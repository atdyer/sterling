import { Intent, Position, Toaster } from '@blueprintjs/core';
import React from 'react';

export const ScriptToaster = Toaster.create({
    position: Position.BOTTOM_RIGHT
});

export function showErrorToast (message: React.ReactNode) {
    console.error(message);
    ScriptToaster.show({
        intent: Intent.DANGER,
        message: message
    });
}
