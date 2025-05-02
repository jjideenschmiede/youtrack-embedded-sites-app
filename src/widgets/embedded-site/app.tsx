import React, {memo, NamedExoticComponent, useEffect} from "react";

import type {EmbeddableWidgetAPI, PluginEndpointAPILayer} from "../../../@types/globals";

import {Configuration} from "./configuration";
import {WidgetConfiguration} from "./types";

/*
 Type Props is an empty object. It is used as a type parameter for the AppComponent.
 */
type Props = object

/*
  AppComponent is a React functional component that serves as the main entry point for the widget.
  It handles the registration of the widget with the host application and manages the configuration state.
 */
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
          <iframe src={config?.url} title={"Test"} allowFullScreen/>
        )}
    </div>
  );
};

/*
  App is a memoized version of the AppComponent component to export as the main entry point for the widget.
 */
export const App : NamedExoticComponent = memo(AppComponent);
