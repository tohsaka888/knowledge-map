/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 14:01:50
 * @Description: 请填写简介 
 */
declare namespace Api {
  type GraphQuery = {
    id: "1093864" | "98536";
    direction: 'in' | 'out';
  }
  type GraphResponse = {
    success: boolean;
    data: {
      nodes: Graph.Node[];
      edges: Graph.Edge[];
    }
  }
  type KnowledgeResponse = {
    success: boolean;
    data: {
      vertices: Graph.Vertice[];
      edges: Graph.Line[];
    }
  }
}