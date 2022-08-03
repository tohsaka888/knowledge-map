/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-03 17:11:30
 * @Description: 请填写简介
 */
import React, { Dispatch } from "react";

declare namespace Graph {
  type Node = {
    id: string;
    name: string;
    type: string;
    mode: number; // 0 主节点 1 入边 2 出边
  }

  type Edge = {
    fromId: string;
    toId: string;
    discription: string;
  }

  type ConfigProps = {
    nodeRadius: number;
    basicDistence: number;
    arcAreaDistence: number;
    arcAreaLength: number;
    mode: number;
    showDisctription: boolean;
    isStraight: boolean;
    besselRate: number;
    lineWidth: number;
    arrowPosition: number;
    setVisible?: React.Dispatch<React.SetStateAction<boolean>>
  }

  type ActionType =
    | { type: 'setMode', payload: number }
    | { type: 'setNodeRadius', payload: number }
    | { type: 'setBasicDistence', payload: number }
    | { type: 'setAreaLength', payload: number }
    | { type: 'setAreaDistence', payload: number }
    | { type: 'setShowDiscription', payload: boolean }
    | { type: 'setIsStraight', payload: boolean }
    | { type: 'setBesselRate', payload: number }
    | { type: 'setLineWidth', payload: number }
    | { type: 'setArrowPosition', payload: number }

  type ConfigContextProps = {
    config: ConfigProps;
    dispatch: Dispatch<ActionType>
  }
}