import { createContext } from "react";

export const NerdGraphQuery = { query: jest.fn() };
export const NerdGraphMutation = { mutate: jest.fn() };
export const ENTITY_GUID = "test-entity-guid";
export const NerdletStateContext = createContext({ entityGuid: ENTITY_GUID });
export const ngql = (query) => query;
