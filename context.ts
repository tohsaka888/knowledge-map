import { createContext } from "react";
import { Graph } from ".";

export const ConfigContext = createContext<Graph.ConfigContextProps | null>(null)