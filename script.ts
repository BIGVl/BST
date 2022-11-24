import Tree from './BST';

//Creates a random array of length equal to the param
const createRandomArray = (length: Number) => {
  const array: number[] = [];
  for (let i = 0; i <= length; i++) {
    array.push(Math.floor(Math.random() * 50) + 1);
  }
  return array;
};

//Use this if you want to visualise the nodes in a more eye-pleasing way in the console, provide the node as the parameter to the function
const prettyPrint = (node: any, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

const randomArr = createRandomArray(12);
const tree = Tree(randomArr);
tree.isBalanced() > 0 ? console.log(true) : console.log(false);
console.log(tree.levelOrder());
console.log(tree.preorder());
console.log(tree.inorder());
console.log(tree.postorder());
tree.insert(123);
tree.insert(127);
tree.insert(128);
tree.insert(123);
console.log(tree.isBalanced());
tree.root = tree.rebalance();
console.log(tree.isBalanced());
console.log(tree.levelOrder());
console.log(tree.preorder());
console.log(tree.inorder());
console.log(tree.postorder());
