import React, {memo, useEffect} from "react";

import type {EmbeddableWidgetAPI, PluginEndpointAPILayer} from "../../../@types/globals";

import {Configuration} from "./configuration";
import {WidgetConfiguration} from "./types";

type Props = object

const AppComponent: React.FunctionComponent<Props> = () => {
  const hostRef = React.useRef<EmbeddableWidgetAPI | null>(null);

  const [isConfiguring, setIsConfiguring] = React.useState(false);
  const [config, setConfig] = React.useState<WidgetConfiguration | null>(null);

  useEffect(() => {
    async function register() {
      const host : EmbeddableWidgetAPI | PluginEndpointAPILayer = await YTApp.register({
        onConfigure: () => setIsConfiguring(true)
      });

      if (!('readConfig' in host)) {
        throw new Error("Wrong type of API returned: probably widget used in wrong extension point");
      }

      hostRef.current = host;

      const configValue : WidgetConfiguration | null = await hostRef.current!.readConfig<WidgetConfiguration>();
	  if (!configValue?.url) {
         await hostRef.current.enterConfigMode();
        setIsConfiguring(true);
      } else {
        setConfig(configValue);
      }
    }

    register();
  }, []);

  const doneConfiguring = React.useCallback((newConfig?: WidgetConfiguration) => {
    setConfig(newConfig ?? null);
    setIsConfiguring(false);
    if (newConfig) {
      hostRef.current?.storeConfig(newConfig);
    }
    hostRef.current?.exitConfigMode();
  }, []);

  return (
    <div className="widget">
      {isConfiguring && hostRef.current
        ? (
          <Configuration onDone={doneConfiguring}/>
        )
        : (
          <iframe src={config?.url} title={"Test"} allowFullScreen></iframe>
        )}

    </div>
  );
};

export const App = memo(AppComponent);
