/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-19 15:03:07
 * @Description: 请填写简介
 */
import React, { Dispatch } from "react";

declare namespace Graph {
  type Node = {
    id: string;
    name: string;
    type: string;
    mode: number; // 0 主节点 1 入边 2 出边
    x?: number; // 仅前端使用
    y?: number; // 仅前端使用
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

  type Vertice = {
    id: string;
    code: string;
    name: string;
    labelName: string;
    hasNextVertices: boolean;
    s?: string[]; // 当前节点包含的子节点的ids
    x?: number; // 仅前端使用
    y?: number; // 仅前端使用
    p?: string[]; // 当前节点所有的父节点
    size?: number;
    angle?: number;
    distance?: number;
    isInside?: boolean;
    propertyMap: {
      model_property_name?: string;
      dkg_sys_code?: string;
      model_name?: string;
      dkg_sys_updated_time?: string;
      dkg_sys_label_name?: string;
      model_property_id?: string;
      dkg_sys_created_time?: string;
      id?: number | string;
      label?: string;
      dkg_sys_name?: string;
    };
  };

  type Line = {
    id: string;
    name: string;
    fromVertexId: string;
    toVertexId: string;
    fromX?: number;
    fromY?: number;
    toX?: number;
    toY?: number;
  };
}