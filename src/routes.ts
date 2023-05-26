import auth, { AuthParams } from '@/utils/authentication';
import { useEffect, useMemo, useState } from 'react';

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
};

export const routes: IRoute[] = [
  {
    name: '仪表盘',
    key: 'dashboard',
    children: [
      {
        name: '工作台',
        key: 'dashboard/workplace',
      },
    ],
  },
  {
    name: '学生功能',
    key: 'student',
    children: [
      {
        name: '存物品',
        key: 'student/deposit',
      },
      {
        name: '取物品',
        key: 'student/take',
      },
    ],
    admin: 'user',
  },
  {
    name: '系统管理',
    key: 'settings',
    admin: 'admin',
    children: [
      {
        name: '用户列表',
        key: 'userList',
      },
      {
        name: '分类列表',
        key: 'classifyList',
      },
      {
        name: '位置列表',
        key: 'locationList',
      },
      {
        name: '货物列表',
        key: 'cargoList',
      },
      {
        name: '存取记录列表',
        key: 'recordList',
      },
    ],
  },
];

export const getName = (path: string, routes) => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};

const useRoute = (userPermission): [IRoute[], string] => {
  const filterRoute = (routes: IRoute[], arr: IRoute[] = []): IRoute[] => {
    for (const route of routes) {
      const { admin, children } = route;

      if (admin === userPermission || !admin) {
        const newRoute: IRoute = { ...route };

        if (children && children.length) {
          newRoute.children = filterRoute(children);
        }

        arr.push(newRoute);
      }
    }

    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(routes);

  useEffect(() => {
    const newRoutes = filterRoute(routes);
    setPermissionRoute(newRoutes);
  }, [JSON.stringify(userPermission)]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      return first?.children?.[0]?.key || first.key;
    }
    return '';
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;
