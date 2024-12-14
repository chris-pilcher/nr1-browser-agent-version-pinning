import React, { Fragment, useState } from 'react';
import { Form, TextField, Button, Stack, StackItem, BlockText, Link } from 'nr1';

function CustomVersionForm({ currentPinnedVersion, onUpdateVersion }) {
    const [version, setVersion] = useState(currentPinnedVersion || '');
    const [error, setError] = useState(null);

    // Regex for version (e.g. v1.234.5 or 1.2.3)
    const versionRegex = /^v?\d+\.\d+\.\d+$/;

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setVersion(inputValue);

        if (!versionRegex.test(inputValue)) {
            setError('Please enter a valid version (e.g., 1.2.3 or v1.2.3)');
        } else {
            setError(null);
        }
    };

    const handleSubmit = () => {
        if (!error && versionRegex.test(version)) {
            const sanitizedVersion = version.startsWith('v') ? version.slice(1) : version;
            onUpdateVersion(sanitizedVersion);
        }
    };

    return (
        <Fragment>
            <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
                Specify a version based on the release number from{' '}
                <Link to="https://github.com/newrelic/newrelic-browser-agent/releases">GitHub</Link>
            </BlockText>
            <Form>
                <TextField
                    value={version}
                    label="Custom Version"
                    placeholder="1.234.5"
                    onChange={handleInputChange}
                    invalid={error}
                />
                <Stack>
                    <StackItem>
                        <Button type={Button.TYPE.PRIMARY} onClick={handleSubmit} disabled={!!error || !version}>
                            Pin Version
                        </Button>
                    </StackItem>
                </Stack>
            </Form>
        </Fragment>
    );
}

export default CustomVersionForm;
