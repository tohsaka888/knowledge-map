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

  type PageContextProps = {
    page: number;
    setPage: React.SetStateAction<React.Dispatch<number>>
  }
}