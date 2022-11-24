const arrayExample = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

interface NodeType {
  left: NodeType | null;
  right: NodeType | null;
  data: number | null;
}

//Node factory
const NodeB = (data: number): NodeType => {
  return {
    left: null,
    right: null,
    data: data || null
  };
};

//BST factory
const buildTree = (array: number[]) => {
  //First sort and remove duplicates
  const sortedArr = (function mergeSort(array: number[]) {
    if (array.length < 2) return array;

    const arrayNoDoubles = [...new Set(array)];
    const splitAt = Math.ceil(arrayNoDoubles.length / 2);
    const leftArray = mergeSort(arrayNoDoubles.slice(0, splitAt));
    const rightArray = mergeSort(arrayNoDoubles.slice(splitAt));
    const sortedArr: number[] = [];

    let lIndex = 0;
    let rIndex = 0;

    for (let i = 0; i < leftArray.length + rightArray.length; i++) {
      if (leftArray[lIndex] < rightArray[rIndex]) {
        sortedArr.push(leftArray[lIndex]);
        lIndex++;
      } else if (leftArray[lIndex] > rightArray[rIndex]) {
        sortedArr.push(rightArray[rIndex]);
        rIndex++;
      } else if (leftArray[lIndex] === undefined) {
        sortedArr.push(rightArray[rIndex]);
        rIndex++;
      } else if (rightArray[rIndex] === undefined) {
        sortedArr.push(leftArray[lIndex]);
        lIndex++;
      }
    }

    return sortedArr;
  })(array);
  function sortedArrToBST(arr: number[], start: number, end: number) {
    //base case
    if (start > end) return null;
    const mid = Math.floor((start + end) / 2);
    const node = NodeB(arr[mid]);
    node.left = sortedArrToBST(arr, start, mid - 1);
    node.right = sortedArrToBST(arr, mid + 1, end);
    return node;
  }

  const root = sortedArrToBST(sortedArr, 0, sortedArr.length - 1);

  return root;
};

const Tree = (array: number[]) => {
  let root: NodeType | null = buildTree(array);

  function insert(data: number) {
    const node = NodeB(data);

    (function findInsertionSpot(root: any): NodeType | null | undefined {
      if (root.data === node.data) return null;
      if (node.data && root.data)
        if (node.data > root.data) {
          if (root.right !== null) return findInsertionSpot(root.right);
          else return (root.right = node);
        } else if (node.data < root.data) {
          if (root.left !== null) return findInsertionSpot(root.left);
          else return (root.left = node);
        }
    })(root);
  }

  /*Note: if the element has : 
  -0 child - just remove the node
  -1 child - remove the node and make the parent point to it's child
  -2 cildren - go to the right subtree of the node and to the most left node, take the value of that node, remove it, and change the value of the node 
  you want to remove with this one's and if this node (the most left on the right subtree one) has 1 child(it can have 1 at most since is the most left)
  repeat the step with 1 child
  */
  function deleteNode(data: number) {
    const nodes = $findHelper(root, null, data);
    if (nodes === null) return null;
    const { parentNode, node } = nodes;

    if (node?.data === data) {
      //0 childs case
      if (node.left === null && node.right === null) {
        if (parentNode?.left?.data === node.data) parentNode.left = null;
        if (parentNode?.right?.data === node.data) parentNode.right = null;
      } //2 children case
      else if (node.left !== null && node.right !== null) {
        const replacement = smallestOnTheRight(node.right);
        const value = replacement.data;
        if (replacement.data) deleteNode(replacement.data);
        node.data = value;
      } //1 child case
      else {
        if (parentNode?.left?.data === node.data) node.right ? (parentNode.left = node.right) : (parentNode.left = node.left);
        else if (parentNode?.right?.data === node.data)
          node.right ? (parentNode.right = node.right) : (parentNode.right = node.left);
      }
    }
  }

  function find(data: number) {
    const finds = $findHelper(root, null, data);
    return finds?.node;
  }

  // should traverse the tree in breadth first traversal
  function levelOrder(callback?: Function) {
    const queue: NodeType[] = root ? [root] : [];
    const arrayofNodeValue: any = [];

    (function traverseRecursively(node: NodeType | null) {
      if (queue.length === 0) return;
      if (node?.left) queue.push(node.left);
      if (node?.right) queue.push(node.right);
      callback === undefined ? arrayofNodeValue.push(queue[0]?.data) : callback(queue[0]);
      queue.shift();
      traverseRecursively(queue[0]);
    })(root);
    return callback === undefined ? arrayofNodeValue : '';
  }

  function inorder(callback?: Function) {
    //left-data-right
    const stack: NodeType[] = root ? [root] : [];
    const arrayOfNodeValue: any = [];
    (function recursivelyInorder(node: NodeType | null) {
      if (node === null) return;
      recursivelyInorder(node.left);
      stack.pop();
      stack.push(node);
      callback === undefined ? arrayOfNodeValue.push(stack[stack.length - 1].data) : callback(stack[stack.length - 1]);
      recursivelyInorder(node.right);
    })(root);

    return callback === undefined ? arrayOfNodeValue : undefined;
  }

  function preorder(callback?: Function) {
    const stack: NodeType[] = root ? [root] : [];
    const arrayOfNodeValue: any = [];
    (function recursivelyPreorder(node: NodeType | null) {
      if (node === null) return;
      stack.pop();
      stack.push(node);
      callback === undefined ? arrayOfNodeValue.push(stack[stack.length - 1].data) : callback(stack[stack.length - 1]);
      recursivelyPreorder(node.left);
      recursivelyPreorder(node.right);
    })(root);

    return callback === undefined ? arrayOfNodeValue : undefined;
  }

  function postorder(callback?: Function) {
    const stack: NodeType[] = root ? [root] : [];

    const arrayOfNodeValue: any = [];

    (function recursivelyPostorder(node: NodeType | null) {
      if (node === null) return;
      recursivelyPostorder(node.left);
      recursivelyPostorder(node.right);
      stack.pop();
      stack.push(node);
      callback === undefined ? arrayOfNodeValue.push(stack[stack.length - 1].data) : callback(stack[stack.length - 1]);
    })(root);
    return callback === undefined ? arrayOfNodeValue : undefined;
  }

  //returns the number of edges in longest path from a given node to a leaf node
  function height(node?: NodeType) {
    let toLeft = 1;
    let toRight = 1;

    while (node?.left) {
      node = node.left;
      toLeft++;
    }
    while (node?.right) {
      node = node.right;
      toRight++;
    }
    return toLeft >= toRight ? toLeft : toRight;
  }

  // returns the number of edges in path from a given node to the tree’s root node.
  function depth(node: NodeType | undefined) {
    let theRoot = { ...root };
    let depthCount: number = 0;

    (function recursiveDepth(node: NodeType | undefined) {
      if (theRoot.data && node?.data)
        if (theRoot.data > node.data) {
          depthCount++;
          //@ts-ignore
          theRoot = theRoot.left;
          //@ts-ignore
          recursiveDepth(node);
        } else if (theRoot.data < node.data) {
          depthCount++;
          //@ts-ignore
          theRoot = theRoot.right;

          //@ts-ignore
          recursiveDepth(node);
        }
    })(node);

    return depthCount;
  }

  //Check if every node of the tree is balanced (meaning that the height between the left and the right subtrees, is not bigger than one)
  function isBalanced(node?: NodeType | null) {
    const newNode = node || root;
    if (node === null) return 0;
    let lH: any = isBalanced(newNode?.left);
    if (lH === -1) return -1;
    let rH: any = isBalanced(newNode?.right);
    if (rH === -1) return -1;
    if (Math.abs(lH - rH) > 1) return -1;
    else return Math.max(lH, rH) + 1;
  }

  const rebalance = () => {
    const sortedArr = inorder();
    const balancedTree = buildTree(sortedArr);
    //@ts-ignore
    return (root = balancedTree);
  };

  //private functions

  function smallestOnTheRight(node: NodeType) {
    {
      while (node.left) {
        node = node.left;
      }
      return node;
    }
  }

  interface returnToDelete {
    parentNode: NodeType | null;
    node: NodeType | undefined;
  }

  function $findHelper(nodeToFound: NodeType | null, parent: NodeType | null, data: number): returnToDelete | null {
    let parentNode = parent;
    let node: NodeType | undefined;
    if (nodeToFound === null) return null;
    if (nodeToFound?.data !== data) parentNode = nodeToFound;
    if (nodeToFound?.data) {
      if (nodeToFound.data > data) return $findHelper(nodeToFound.left, parentNode, data);
      else if (nodeToFound.data < data) return $findHelper(nodeToFound.right, parentNode, data);
    }
    if (nodeToFound.data === data) node = nodeToFound;

    return { parentNode, node };
  }

  return { root, insert, deleteNode, find, levelOrder, inorder, preorder, postorder, height, depth, isBalanced, rebalance };
};

export default Tree;
