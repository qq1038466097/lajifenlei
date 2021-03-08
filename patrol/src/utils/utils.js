const getCostTypeTitle = function(type) {
  if (type === 1) {
    return {
      firstTitle: "首件(个)",
      ContinuedTitle: "续件(个)"
    };
  }
  return {
    firstTitle: "首重(KG)",
    ContinuedTitle: "续重(KG)"
  };
};
// 转换城市为{key:'',title:'',pid:'0',clength:0}类型
const getNodesByAllCity = (allCity, pid = "0") => {
  //将城市所有转化成数组操作
  let _allCity = [...allCity];
  let nodes = [];
  for (let i = 0; i < _allCity.length; i++) {
    let { key, title } = { ..._allCity[i] };
    let item = {
      key,
      title,
      pid,
      clength: 0
    };
    if (_allCity[i].children) {
      item.clength = _allCity[i].children.length;
      let res = getNodesByAllCity(_allCity[i].children, key);
      nodes = nodes.concat(res);
    }
    nodes.push(item);
  }
  return nodes;
};

//编辑的时候，原来没有clength
const getClength = (allCity) =>{
  let _allCity = [...allCity]
  let nodes = [];
  for(let i=0; i<_allCity.length; i++){
    let { key, title } = { ..._allCity[i] };
    let item = {
      key,
      title
    }
    if(_allCity[i].children){
      item.clength = _allCity[i].children.length;
      item.children = getClength(_allCity[i].children)
    }else{
      item.clength =0
    }
    nodes.push(item)
  }
  return nodes;
}

// 转换城市为{key:'',title:'',pid:''0,clength:0}类型
const getNodesByCity = (allCity, pid = '0') => {
  let _allCity = [...allCity];
  let nodes = [];
  for (let i = 0; i < _allCity.length; i++) {
    let { key, title, clength } = { ..._allCity[i] };
    let item = {
      key,
      title,
      pid,
      clength
    };
    if (_allCity[i].children) {
      let res = getNodesByCity(_allCity[i].children, key);
      nodes = nodes.concat(res);
    }
    nodes.push(item);
  }
  return nodes;
};
// 递归生成树节点{{{{}}}}
const getTreeByNodes = (mnode, pid = "0") => {
  let node = [...mnode];
  let nodeTree = [];
  for (let i = 0; i < node.length; i++) {
    //生成第一级目录
    if (node[i].pid === pid) {
      let _node = { ...node[i] };
      _node.children = getTreeByNodes(mnode, node[i].key);
      if (_node.children.length === 0) {
        delete _node.children;
      }
      nodeTree.push(_node);
    }
  }
  return nodeTree;
};
// 根据keys得到node节点
const getNodesByKeys = (node, keys) => {
  let nodes = [];
  for (let i = 0; i < node.length; i++) {
    for (let k = 0; k < keys.length; k++) {
      if (keys[k] === node[i].key) {
        nodes.push(node[i]);
      }
    }
  }
  return nodes;
};
// 根据checkedKeys删除nodes节点返回剩余的nodes
const getNodesByCheckedKeys = (_oldNodes, _removeNodes) => {
  let oldNodes = [..._oldNodes];
  let removeNodes = [..._removeNodes];
  for (let i = 0; i < removeNodes.length; i++) {
    for (let j = 0; j < oldNodes.length; j++) {
      // 删除后可能不存在节点，这里判断下
      if (oldNodes[j] && oldNodes[j].key === removeNodes[i]) {
        oldNodes.splice(j, 1);
      }
    }
  }
  if (!oldNodes) {
    oldNodes = [];
  }
  return oldNodes;
};
// 合并上一次和这次选择的节点，并去重
const concatChoose = (oldVal, newVal) => {
  for (let i = 0; i < oldVal.length; i++) {
    let flag = true;
    for (let j = 0; j < newVal.length; j++) {
      if (oldVal[i].key === newVal[j].key) {
        flag = false;
      }
    }
    if (flag) {
      newVal.push(oldVal[i]);
    }
  }
  return newVal;
};
// 根据树得到配送区域名字
let municipality = ["110000", "120000", "310000", "500000"];
const getNamesByTree = tree => {
  let ntree = [...tree];
  let names = "";
  let reg = /\(/gi;
  for (let i = 0; i < ntree.length; i++) {
    // 非直辖市，
    if (municipality.indexOf(ntree[i].key) === -1) {
      names += `${ntree[i].title}`;
      if (ntree[i].children) {
        let res = getNamesByTree(ntree[i].children);
        let length = res.split("，").length;
        if (length !== ntree[i].clength) {
          names += `(${res})`;
        } else if (reg.test(res)) {
          // 如果有（xxx）子项
          names += `(${res})`;
        }
      }
    } else {
      names += `${ntree[i].title}`;
      if (ntree[i].children) {
        if (
          ntree[i].children[0].children.length !== ntree[i].children[0].clength
        ) {
          let res = getNamesByTree(ntree[i].children[0].children);
          names += `(${res})`;
        }
      }
    }

    names += "，";
  }

  names = names.substr(0, names.length - 1);

  return names;
};

//提交数据的时候，只保留key,title,children，
const subData = (_tree) =>{
  let newCity = recursive(_tree)
  function recursive(data){
    let _data =[]
    for (let i = 0; i < data.length; i++) {
      let item = {
        key:data[i].key,
        title:data[i].title
      }
      if(data[i].children){
        item.children = recursive(data[i].children)
      }
      _data.push(item)
    }
    return _data
  }
  return JSON.stringify(newCity)
}

// 根据tree得到筛选的keys
const getKeysByTree = tree => {
  let keys = [];
  for (let i = 0; i < tree.length; i++) {
    // 非直辖市，
    if (municipality.indexOf(tree[i].key) === -1) {
      if (tree[i].children) {
        if (tree[i].clength === tree[i].children.length) {
          keys.push(tree[i].key);
        }
        let childKeys = getKeysByTree(tree[i].children);
        keys = keys.concat(childKeys);
      } else {
        keys.push(tree[i].key);
      }
    } else if (tree[i].children) {
      if (tree[i].children[0].children.length === tree[i].children[0].clength) {
        keys.push(tree[i].key);
      }
      let childKeys = getKeysByTree(tree[i].children[0].children);
      keys = keys.concat(childKeys);
    }
  }
  return keys.join(',');
};

//根据已有，所有的数据，删除以后，变成最后可用的数据
const geitNewCity = (nodes,allCity)=>{
  let _nodes2 = [...nodes]
  let _allCity = [...allCity]
  //首先删除所有的第三级
  for(let i=0; i<_nodes2.length; i++){
    for(let j=0; j<_allCity.length; j++){
      //删除所有的第三级
      if(_nodes2[i].key==_allCity[j].key&&_nodes2[i].clength==0&&_allCity[j].clength==0){
        _allCity.splice(j,1);
      }
    }
  }
 let _nodes = _nodes2.filter(item=>item.clength!==0)
 let _hasNode = []
  //删除第二级
  for(let i=0; i<_nodes.length; i++){
    if(parseInt(_nodes[i].pid)!==0){
      for(let j=0; j<_allCity.length; j++){
        if(_nodes[i].key==_allCity[j].key&&_nodes[i].clength==_allCity[j].clength){
          //删除对应的第二级
          _hasNode.push(_nodes[i])
          _allCity.splice(j,1)
          //_nodes.splice(i,1)
          break;
        }
      }
    }
  }

  for(let i=0; i<_hasNode.length; i++){
    for(let j=0; j<_nodes.length; j++){
      if(_hasNode[i].key == _nodes[j].key){
        _nodes.splice(j,1)
        break;
      }
    }
  }

  //删除第一级
  for(let i=0; i<_nodes.length; i++){
    if(parseInt(_nodes[i].pid)==0){
      let _key = _nodes[i].key
      let _fla = false
      _fla = false
      for(let j=0; j<_nodes.length; j++){
        if(_nodes[j].pid == _key){
          _fla=true
          break;
        }
      }
      //证明还存在第二级，不能删除第一级
      if(!_fla){
        //_nodes.splice(i,1)
        for(let c=0; c<_allCity.length; c++){
          if(_allCity[c].key == _key){
            _allCity.splice(c,1)
            break;
          }
        }
      }
    }
  }
  //console.log(_nodes)
  //console.log(_allCity)
  return _allCity;
}

//删除规格的时候，将已选的重新添加进去
const delAddToAddNodes = (adds,olds)=>{
  let _adds = [...adds]
  let _olds = [...olds]
  for(let i=0; i<_adds.length; i++){
    let _fla = false
    for(let j=0; j<olds.length; j++){
      if(_adds[i].key == olds[j].key){
        _fla=true
        break;
      }
    }
    //没有重复，添加进去
    if(!_fla){
      _olds.unshift(_adds[i])
    }
  }
  return _olds;
}

module.exports = {
  getCostTypeTitle,
  getNodesByAllCity,
  getNodesByCity,
  getTreeByNodes,
  getNodesByKeys,
  getNodesByCheckedKeys,
  concatChoose,
  getNamesByTree,
  getKeysByTree,
  subData,
  geitNewCity,
  getClength,
  delAddToAddNodes
};
