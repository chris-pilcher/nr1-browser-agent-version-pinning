import React from 'react';
import { Form, TextField, Button, Stack, StackItem } from 'nr1';

function CustomVersionForm({ currentPinnedVersion, onUpdateVersion }) {
    return (
        <Form>
            <TextField defaultValue={currentPinnedVersion} label="Custom Version" placeholder="v1.234.5" />
            <Stack>
                <StackItem>
                    <Button type={Button.TYPE.PRIMARY}>Pin Version</Button>
                </StackItem>
            </Stack>
        </Form>
    );
}

export default CustomVersionForm;
