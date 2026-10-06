import json
import shutil
from pathlib import Path
from graphify.build import build_merge
from graphify.detect import save_manifest

# Save old graph for comparison diff later
if Path('graphify-out/graph.json').exists():
    shutil.copy('graphify-out/graph.json', 'graphify-out/.graphify_old.json')

# Load new extraction and incremental state
new_extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding="utf-8"))
incremental = json.loads(Path('graphify-out/.graphify_incremental.json').read_text(encoding="utf-8"))
deleted = list(incremental.get('deleted_files', []))
changed = [f for files in incremental.get('new_files', {}).values() for f in files]
prune = list(dict.fromkeys(deleted + changed)) or None

# Use build_merge() - reads graph.json directly
G = build_merge(
    [new_extraction],
    graph_path='graphify-out/graph.json',
    prune_sources=prune,
)
print(f'[graphify update] Merged: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges')

# Write merged result back to .graphify_extract.json so Step 4 sees the full graph
merged_out = {
    'nodes': [{'id': n, **d} for n, d in G.nodes(data=True)],
    'edges': [
        {**{k: val for k, val in d.items() if k not in ('_src', '_tgt', 'source', 'target')},
         'source': d.get('_src', u), 'target': d.get('_tgt', v)}
        for u, v, d in G.edges(data=True)
    ],
    'hyperedges': list(G.graph.get('hyperedges', [])),
    'input_tokens': new_extraction.get('input_tokens', 0),
    'output_tokens': new_extraction.get('output_tokens', 0),
}
Path('graphify-out/.graphify_extract.json').write_text(json.dumps(merged_out, indent=2, ensure_ascii=False), encoding="utf-8")
print(f'[graphify update] Merged extraction written ({len(merged_out["nodes"])} nodes, {len(merged_out["edges"])} edges)')

# Save manifest so next --update diffs against today's state
save_manifest(incremental['files'])
print('[graphify update] Manifest saved.')
