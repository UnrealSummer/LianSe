/**
 * Cocos Creator Mock
 * 模拟Cocos引擎的基础API
 */

export const _decorator = {
  ccclass: () => (target: any) => target,
  property: () => (target: any, propertyKey: string) => {}
};

export class Component {
  node: Node = new Node();
  start() {}
  update(dt: number) {}
  onDestroy() {}
}

export class Node {
  children: Node[] = [];
  parent: Node | null = null;
  active: boolean = true;
  position: Vec3 = new Vec3();
  
  addChild(child: Node) {
    this.children.push(child);
    child.parent = this;
  }
  
  removeChild(child: Node) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }
  
  getComponent<T>(type: any): T | null {
    return null;
  }
  
  destroy() {
    this.active = false;
  }
}

export class Vec3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Color {
  r: number = 255;
  g: number = 255;
  b: number = 255;
  a: number = 255;
  
  constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

export class Label extends Component {
  string: string = '';
  color: Color = new Color();
}

export class Sprite extends Component {
  color: Color = new Color();
}

export const sys = {
  localStorage: {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => {},
    removeItem: (key: string) => {}
  }
};

export const director = {
  loadScene: (sceneName: string, callback?: Function) => {
    if (callback) callback();
  }
};

export const tween = (target: any) => ({
  to: (duration: number, props: any, opts?: any) => ({
    start: () => {}
  }),
  by: (duration: number, props: any, opts?: any) => ({
    start: () => {}
  }),
  call: (callback: Function) => ({
    start: () => {}
  })
});

export const v3 = (x: number = 0, y: number = 0, z: number = 0) => new Vec3(x, y, z);
