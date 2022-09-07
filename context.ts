/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 09:52:30
 * @Description: 请填写简介
 */
import { createContext } from "react";
import { Graph } from ".";

export const ConfigContext = createContext<Graph.ConfigContextProps | null>(null)
export const DrawContext = createContext<Graph.DrawContextProps | null>(null)