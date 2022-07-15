declare namespace Api {
  type GraphResponse = {
    success: boolean;
    data: {
      nodes: Graph.Node[];
      edges: Graph.Edge[]
    }
  }
}