import { Tool, ToolTier } from "@/lib/diy/tools";
import { ExternalLink } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

const tierConfig: Record<ToolTier, { label: string; color: string }> = {
  free: { label: "FREE", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  freemium: { label: "FREEMIUM", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  trial: { label: "TRIAL", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
};

export function ToolCard({ tool }: ToolCardProps) {
  const tierStyle = tierConfig[tool.tier];

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/10 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {tool.icon && <span className="text-2xl">{tool.icon}</span>}
          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
            {tool.name}
          </h3>
        </div>
        <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded border ${tierStyle.color} font-medium`}>
          {tierStyle.label}
        </span>
        {tool.limit && (
          <span className="text-xs text-zinc-500">{tool.limit}</span>
        )}
      </div>

      {tool.platforms && (
        <div className="flex gap-1 mb-2">
          {tool.platforms.map((platform) => (
            <span
              key={platform}
              className="text-xs px-2 py-0.5 rounded bg-zinc-700/50 text-zinc-400"
            >
              {platform === "web" && "🌐"}
              {platform === "mobile" && "📱"}
              {platform === "desktop" && "💻"}
            </span>
          ))}
        </div>
      )}

      {tool.features && (
        <div className="flex flex-wrap gap-1">
          {tool.features.map((feature) => (
            <span
              key={feature}
              className="text-xs text-zinc-400"
            >
              • {feature}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
