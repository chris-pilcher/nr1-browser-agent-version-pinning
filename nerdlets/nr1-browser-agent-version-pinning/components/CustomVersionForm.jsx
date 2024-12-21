import React, { Fragment, useState } from "react";
import { Form, TextField, Button, BlockText, Link, logger } from "nr1";
import { usePinnedVersion } from "../hooks";

function CustomVersionForm() {
  const { version: currentPinnedVersion } = usePinnedVersion();
  const [version, setVersion] = useState(currentPinnedVersion);
  const [invalid, setInvalid] = useState(false);

  // Regex for version (e.g. v1.234.5 or 1.2.3)
  const versionRegex = /^v?\d+\.\d+\.\d+$/;

  const handleInputChange = (event) => {
    const inputValue = event.target.value.trim();
    setInvalid(!versionRegex.test(inputValue));
    setVersion(inputValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (versionRegex.test(version)) {
      const versionWithoutPrefix = version.startsWith("v") ? version.slice(1) : version;
      logger.log("TODO: Pin version to", versionWithoutPrefix);
      // onUpdateVersion(versionWithoutPrefix);
    }
  };

  return (
    <Fragment>
      <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
        Specify a version based on the release number from{" "}
        <Link to="https://github.com/newrelic/newrelic-browser-agent/releases">GitHub</Link>
      </BlockText>
      <Form onSubmit={handleSubmit} spacingType={[Form.SPACING_TYPE.MEDIUM]}>
        <TextField
          value={version}
          label="Custom Version"
          description="Enter a version number (e.g., 1.2.3 or v1.2.3)"
          placeholder="1.234.5"
          onChange={handleInputChange}
          invalid={invalid}
        />
        {/* NR1 didn't let me specify type="submit" so I had to use onClick */}
        <Button
          type={Button.TYPE.PRIMARY}
          disabled={invalid || !version}
          onClick={handleSubmit}
          test={"my really long value"}>
          Pin Version
        </Button>
      </Form>
    </Fragment>
  );
}

export default CustomVersionForm;
