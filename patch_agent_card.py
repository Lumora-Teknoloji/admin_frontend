import re

file_path = "c:/Users/Admin/Documents/vscode/admin_frontend/src/components/AgentCard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add syncing to STATUS_CONFIG
content = content.replace(
    'completed: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Tamamlandı", icon: Package },',
    'completed: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Tamamlandı", icon: Package },\n    syncing: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", label: "Aktarıyor", icon: Database },'
)

# 2. Add syncing to outer card
content = content.replace(
    'agent.status === "scraping" && "bg-blue-900/10 shadow-blue-500/10 border-blue-500/40 shadow-2xl scale-[1.02]",',
    'agent.status === "scraping" && "bg-blue-900/10 shadow-blue-500/10 border-blue-500/40 shadow-2xl scale-[1.02]",\n            agent.status === "syncing" && "bg-purple-900/10 shadow-purple-500/10 border-purple-500/40 shadow-2xl scale-[1.02]",'
)

# 3. Add syncing to accent line
content = content.replace(
    'agent.status === "scraping" && "via-blue-500 animate-pulse",',
    'agent.status === "scraping" && "via-blue-500 animate-pulse",\n                agent.status === "syncing" && "via-purple-500 animate-pulse",'
)

# 4. Icon spin
content = content.replace(
    'agent.status === "scraping" && "animate-spin"',
    '(agent.status === "scraping" || agent.status === "syncing") && "animate-spin"'
)

# 5. Agent name color
content = content.replace(
    'agent.status === "scraping" ? "text-blue-50" : "text-white"',
    '(agent.status === "scraping" || agent.status === "syncing") ? "text-blue-50" : "text-white"'
)

# 6. Dot pulse
content = content.replace(
    'agent.status === "scraping" ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "",',
    'agent.status === "scraping" ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "",\n                                agent.status === "syncing" ? "bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "",'
)

# 7. Current task box
content = content.replace(
    'agent.status === "scraping" ? "bg-blue-500/10 border-blue-500/20" : "bg-white/5 border-white/10"',
    'agent.status === "scraping" ? "bg-blue-500/10 border-blue-500/20" : agent.status === "syncing" ? "bg-purple-500/10 border-purple-500/20" : "bg-white/5 border-white/10"'
)

content = content.replace(
    'agent.status === "scraping" ? "text-blue-400" : "text-gray-400"',
    'agent.status === "scraping" ? "text-blue-400" : agent.status === "syncing" ? "text-purple-400" : "text-gray-400"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Patched {file_path}")
