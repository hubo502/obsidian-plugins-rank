// import state from "@/data/state.json";
// import plugins from "@/data/plugins.json";
import { Download } from "lucide-react";
import paths from "@/data/paths.json";
// function resolvePlugins() {
//   return plugins.map((plugin) => {
//     if (state.hasOwnProperty(plugin.id)) {
//       return {
//         ...plugin,
//         ...((state as Plugins)[plugin.id] as any),
//       };
//     } else {
//       return { ...plugin, downloads: 0 };
//     }
//   });
// }

type Plugins = { [key: string]: any };

async function resolveRemotePlugins(): Promise<Plugins> {
  const { plugins, states } = paths;
  const pluginData = await fetch(plugins, { next: { revalidate: 60 * 60 * 24 } }).then((res) => res.json());
  const statesData = await fetch(states, { next: { revalidate: 60 * 60 * 24 } }).then((res) => res.json());

  return pluginData.map((plugin: any) => {
    if (statesData.hasOwnProperty(plugin.id)) {
      return {
        ...plugin,
        ...((statesData as Plugins)[plugin.id] as any),
      };
    } else {
      return { ...plugin, downloads: 0 };
    }
  }) as Plugins;
}

export default async function Home() {
  const plugins = await resolveRemotePlugins();

  const ranked = plugins.sort(function (a: any, b: any) {
    return b.downloads - a.downloads;
  });

  return (
    <table className="table m-4">
      <thead>
        <tr>
          <th>#</th>
          <th>downloads</th>
          <th>name</th>
          <th>install</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((plugin: any, index: number) => (
          <tr key={index} className="group">
            <td>{++index}</td>
            <td>{plugin.downloads}</td>
            <td className="">
              <a title="View Repo" className="underline hover:text-violet-900 text-violet-600" href={`https://github.com/${plugin.repo}`} target="_blank">
                {plugin.name}
              </a>
            </td>
            <td>
              <a href={`obsidian://show-plugin?id=${plugin.id}`} title="Install" className=" text-violet-600 hover:text-violet-900">
                <Download className="w-4 h-auto" />
              </a>
            </td>
            <td>{plugin.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
