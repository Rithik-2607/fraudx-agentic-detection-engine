import React, { useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getRiskLevel } from '../../utils/riskColors';

// Custom Node component
const AccountNode = ({ data }) => {
  const risk = getRiskLevel(data.risk);
  const isHighlighted = data.isHighlighted;

  return (
    <div
      className={`px-4 py-2.5 rounded-lg border-2 bg-surface-850 font-mono text-center shadow-lg transition-all duration-300 ${
        isHighlighted
          ? 'scale-110 shadow-accent-cyan/10'
          : ''
      }`}
      style={{
        borderColor: isHighlighted ? '#22d3ee' : risk.color,
        backgroundColor: '#0f1424',
        boxShadow: isHighlighted ? '0 0 12px rgba(34, 211, 238, 0.4)' : 'none',
      }}
    >
      <div className="text-xs font-bold text-white mb-0.5">{data.label}</div>
      <div className="text-[10px] font-semibold" style={{ color: risk.color }}>
        Risk: {data.risk}
      </div>
      {data.role && (
        <div className="text-[8px] text-surface-200 mt-0.5 tracking-wider uppercase">
          {data.role}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  account: AccountNode,
};

export default function FraudNetwork({ nodes: initialNodes, edges: initialEdges, highlightNodes = [], onNodeClick }) {
  // Build React Flow nodes
  const processedNodes = useMemo(() => {
    return initialNodes.map((node) => {
      const isHighlighted = highlightNodes.includes(node.id);
      return {
        id: node.id,
        type: 'account',
        position: node.position || { x: Math.random() * 200, y: Math.random() * 200 },
        data: {
          label: node.id,
          risk: node.risk || 0,
          role: node.role,
          isHighlighted,
        },
      };
    });
  }, [initialNodes, highlightNodes]);

  // Build React Flow edges
  const processedEdges = useMemo(() => {
    return initialEdges.map((edge, index) => {
      const isFlowHighlighted =
        highlightNodes.includes(edge.source) && highlightNodes.includes(edge.target);

      return {
        id: `e-${edge.source}-${edge.target}-${index}`,
        source: edge.source,
        target: edge.target,
        animated: isFlowHighlighted || edge.animated || false,
        style: {
          stroke: isFlowHighlighted ? '#22d3ee' : 'rgba(107, 116, 148, 0.4)',
          strokeWidth: isFlowHighlighted ? 2.5 : 1.5,
        },
        label: edge.amount ? `₹${(edge.amount / 1000).toFixed(0)}K` : undefined,
        labelStyle: { fill: '#9ca3b8', fontSize: 8, fontFamily: 'monospace', fontWeight: 'bold' },
        labelBgStyle: { fill: '#0a0e1a', fillOpacity: 0.8 },
      };
    });
  }, [initialEdges, highlightNodes]);

  const handleNodeClickEvent = (event, node) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  };

  return (
    <div className="w-full h-full bg-surface-900 border border-surface-600/30 rounded-xl overflow-hidden relative">
      <ReactFlow
        nodes={processedNodes}
        edges={processedEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClickEvent}
        fitView
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1c2340" gap={16} size={1} />
        <Controls className="bg-surface-800 border border-surface-600/50 rounded-lg text-white fill-white stroke-white shadow-xl [&>button]:border-surface-600/30 [&>button]:bg-surface-800 [&>button]:text-white [&_path]:fill-surface-100 hover:[&>button]:bg-surface-700" />
      </ReactFlow>
    </div>
  );
}
