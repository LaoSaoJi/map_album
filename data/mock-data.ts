export type CityPhoto = {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  note: string;
};

export type CityAlbum = {
  id: string;
  name: string;
  englishName: string;
  x: number;
  y: number;
  focusX: number;
  focusY: number;
  photoCount: number;
  cover: string;
  photos: CityPhoto[];
};

export const cityAlbums: CityAlbum[] = [
  {
    id: "shanghai",
    name: "上海",
    englishName: "Shanghai",
    x: 77,
    y: 53,
    focusX: 607,
    focusY: 388,
    photoCount: 126,
    cover:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "sh-001",
        title: "外滩夜景",
        date: "2025-12-05",
        imageUrl:
          "https://images.unsplash.com/photo-1547981609-4b6bf67dbff1?auto=format&fit=crop&w=1200&q=80",
        note: "黄昏后的江面反光非常好看"
      },
      {
        id: "sh-002",
        title: "武康路午后",
        date: "2025-11-11",
        imageUrl:
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
        note: "梧桐落叶季"
      },
      {
        id: "sh-003",
        title: "迪士尼巡游",
        date: "2025-10-18",
        imageUrl:
          "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
        note: "第一次带家人来"
      }
    ]
  },
  {
    id: "beijing",
    name: "北京",
    englishName: "Beijing",
    x: 69,
    y: 33,
    focusX: 542,
    focusY: 248,
    photoCount: 84,
    cover:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "bj-001",
        title: "故宫雪后",
        date: "2025-01-20",
        imageUrl:
          "https://images.unsplash.com/photo-1583396618422-8fd4f609a5c9?auto=format&fit=crop&w=1200&q=80",
        note: "红墙白雪对比很强"
      },
      {
        id: "bj-002",
        title: "奥森晨跑",
        date: "2025-04-06",
        imageUrl:
          "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
        note: "空气很好"
      },
      {
        id: "bj-003",
        title: "鼓楼夜骑",
        date: "2025-09-13",
        imageUrl:
          "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1200&q=80",
        note: "胡同小店很好吃"
      }
    ]
  },
  {
    id: "guangzhou",
    name: "广州",
    englishName: "Guangzhou",
    x: 70,
    y: 72,
    focusX: 501,
    focusY: 507,
    photoCount: 47,
    cover:
      "https://images.unsplash.com/photo-1526481280695-3c4696bf9740?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "gz-001",
        title: "珠江日落",
        date: "2025-08-02",
        imageUrl:
          "https://images.unsplash.com/photo-1573132223215-5d8f5e4efcab?auto=format&fit=crop&w=1200&q=80",
        note: "晚霞很通透"
      },
      {
        id: "gz-002",
        title: "早茶时间",
        date: "2025-08-03",
        imageUrl:
          "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
        note: "点了虾饺和叉烧包"
      }
    ]
  },
  {
    id: "chengdu",
    name: "成都",
    englishName: "Chengdu",
    x: 52,
    y: 60,
    focusX: 389,
    focusY: 392,
    photoCount: 63,
    cover:
      "https://images.unsplash.com/photo-1517742264530-4bde8fdd6f73?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "cd-001",
        title: "人民公园",
        date: "2025-06-10",
        imageUrl:
          "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1200&q=80",
        note: "慢节奏下午"
      },
      {
        id: "cd-002",
        title: "都江堰",
        date: "2025-06-12",
        imageUrl:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
        note: "山水很舒服"
      }
    ]
  },
  {
    id: "xian",
    name: "西安",
    englishName: "Xi'an",
    x: 58,
    y: 51,
    focusX: 446,
    focusY: 322,
    photoCount: 39,
    cover:
      "https://images.unsplash.com/photo-1533526513810-9f615d66d2f8?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        id: "xa-001",
        title: "城墙骑行",
        date: "2025-03-14",
        imageUrl:
          "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
        note: "风很大但很爽"
      },
      {
        id: "xa-002",
        title: "回民街",
        date: "2025-03-14",
        imageUrl:
          "https://images.unsplash.com/photo-1452104955232-9c40f5f84d60?auto=format&fit=crop&w=1200&q=80",
        note: "晚餐很丰富"
      }
    ]
  }
];
