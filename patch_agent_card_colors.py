import re

file_path = "c:/Users/Admin/Documents/vscode/admin_frontend/src/components/AgentCard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'RefreshCw,',
    'RefreshCw,\n    Search,\n    Download,'
)

# 2. STATUS_CONFIG
content = content.replace(
    'syncing: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", label: "Aktarıyor", icon: Database }',
    'syncing: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", label: "Aktarıyor", icon: Database },\n    linking: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Link Buluyor", icon: Search },\n    extracting: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Veri Çekiyor", icon: Download }'
)

# 3. Add to outer card
content = content.replace(
    'agent.status === "scraping" && "bg-blue-900/10 shadow-blue-500/10 border-blue-500/40 shadow-2xl scale-[1.02]",',
    'agent.status === "scraping" && "bg-blue-900/10 shadow-blue-500/10 border-blue-500/40 shadow-2xl scale-[1.02]",\n            agent.status === "extracting" && "bg-blue-900/10 shadow-blue-500/10 border-blue-500/40 shadow-2xl scale-[1.02]",\n            agent.status === "linking" && "bg-amber-900/10 shadow-amber-500/10 border-amber-500/40 shadow-2xl scale-[1.02]",'
)

# 4. Top accent line
content = content.replace(
    'agent.status === "scraping" && "via-blue-500 animate-pulse",',
    'agent.status === "scraping" && "via-blue-500 animate-pulse",\n                agent.status === "extracting" && "via-blue-500 animate-pulse",\n                agent.status === "linking" && "via-amber-500 animate-pulse",'
)

# 5. Icon Spin, Text colors, etc.
# Many places use: agent.status === "scraping"
# We need to replace all basic condition checks but not the ones we just added.
# To be safe, we just define a `const isScrapingLike = agent.status === "scraping" || agent.status === "linking" || agent.status === "extracting";` in the render? Simple string replacement is fine.
content = content.replace(
    '(agent.status === "scraping" || agent.status === "syncing]',
    '(agent.status === "scraping" || agent.status === "linking" || agent.status === "extracting" || agent.status === "syncing")'
)

content = content.replace(
    '(agent.status === "scraping" || agent.status === "syncing")',
    '(agent.status === "scraping" || agent.status === "linking" || agent.status === "extracting" || agent.status === "syncing")'
)

# 6. Pulse dot
content = content.replace(
    'agent.status === "scraping" ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "",',
    'agent.status === "scraping" ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "",\n                                agent.status === "extracting" ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "",\n                                agent.status === "linking" ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "",'
)

# 7. Task box and progress
content = content.replace(
    'agent.status === "scraping" ? "bg-blue-500/10 border-blue-500/20" : agent.status === "syncing"',
    'agent.status === "scraping" || agent.status === "extracting" ? "bg-blue-500/10 border-blue-500/20" : agent.status === "linking" ? "bg-amber-500/10 border-amber-500/20" : agent.status === "syncing"'
)

content = content.replace(
    'agent.status === "scraping" ? "text-blue-400" : agent.status === "syncing"',
    'agent.status === "scraping" || agent.status === "extracting" ? "text-blue-400" : agent.status === "linking" ? "text-amber-400" : agent.status === "syncing"'
)

content = content.replace(
    'agent.status === "scraping" && (',
    '(agent.status === "scraping" || agent.status === "extracting" || agent.status === "linking") && ('
)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied to colors!")
