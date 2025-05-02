import React, {memo, NamedExoticComponent} from "react";
import Input from "@jetbrains/ring-ui-built/components/input/input";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import ButtonSet from "@jetbrains/ring-ui-built/components/button-set/button-set";

import {WidgetConfiguration} from "./types";

/*
 Props interface defines the shape of the props that the ConfigurationComponent will receive.
 It includes a single function prop `onDone` that will be called when the configuration is done.
 */
interface Props {
  onDone: (config?: WidgetConfiguration) => void;
}

/*
 ConfigurationComponent is a React functional component that renders a form for configuring a widget.
 It allows the user to input a URL and save it as part of the widget's configuration.
 */
const ConfigurationComponent: React.FunctionComponent<Props> = ({onDone}) => {
  const [value, setValue] = React.useState("");

  const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const onSubmit = React.useCallback(async () => {
    if (!value) {
      return;
    }
    onDone({url: value});
  }, [onDone, value]);

  return (
    <form className="ring-form">
      <span className="ring-form__title">{"Widget configuration"}</span>
      <Input label="URL" value={value} onChange={onChange}/>
      <ButtonSet className="config-buttons">
        <Button primary disabled={!value} onClick={onSubmit}>{"Save"}</Button>
        <Button onClick={() => onDone()}>{"Cancel"}</Button>
      </ButtonSet>
    </form>
  );
};

/*
 Configuration is a memoized version of the ConfigurationComponent.
 */
export const Configuration : NamedExoticComponent<Props> = memo(ConfigurationComponent);
