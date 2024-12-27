import React from "react";
import { Stack, StackItem } from "nr1";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmationModal, PinningStatus, ManagePinning } from "./components";
import { ModalProvider } from "./context";

const queryClient = new QueryClient();

export default function BrowserAgentVersionPinningNerdlet() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <ConfirmationModal />
        <Stack
          directionType={Stack.DIRECTION_TYPE.VERTICAL}
          horizontalType={Stack.HORIZONTAL_TYPE.FILL}
          gapType={Stack.GAP_TYPE.NONE}
          fullWidth>
          <StackItem>
            <PinningStatus />
          </StackItem>
          <StackItem>
            <ManagePinning />
          </StackItem>
        </Stack>
      </ModalProvider>
    </QueryClientProvider>
  );
}
