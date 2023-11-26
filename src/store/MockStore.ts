//export const bg = ["1e82a6", "1EA663", "931EA6", "A61E38", "55A61E", "1EA6A1"];
export const bg = ["#1e82a6"];
//export const bg = ["transparent"];

const _images = [
  "https://images.unsplash.com/photo-1674244429622-d93d9b84556e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDgyMw&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1673913817163-0fcc3e5ee006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDg1NA&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1672845977153-a36851780cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDg4MA&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1672575395994-835afaaeb376?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDkwMw&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1667162964142-577959f9cefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDkxNw&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1671723521246-a6710cfafc70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDkyOA&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1673032413639-f2ebc0a82c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDk0Nw&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1672651158855-f225fe553b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDQzMDk1OQ&ixlib=rb-4.0.3&q=80&w=1080",
];

export interface CarouselProps {
  cameraViews: Camera[];
  store: any;
}

export interface FPSprite {
  name: string;
  texture: any;
}

export interface FPSprites {
  fpSprites: FPSprite[];
}

export interface Game {
  startTime: number;
  prize: string;
  description: string;
  thumbnail: string;
  status: Status[];
  currentStatus: string;
}

export interface Games {
  games: Game[];
}

export interface Status {
  status: StatusItem;
}

export interface StatusItem {
  image: string;
  name: string;
}

export interface Clue {
  answer: string;
  description: string;
  image: string;
  name: string;
  question: string;
  type: string;
}

export interface Camera {
  cameraCarouselThumbnail: string;
  clue: Clue;
  videoThumbnail: string;
  VideoUrl: string;
}

export const _cameras: Camera[] = [
  {
    VideoUrl: _images[0],
    videoThumbnail: _images[0],
    cameraCarouselThumbnail: _images[0],
    clue: {
      answer: "test 0",
      description: "test 0",
      image: _images[0],
      name: "test 0",
      question: "test 0 question",
      type: "bool",
    },
  },
  {
    VideoUrl: _images[1],
    videoThumbnail: _images[1],
    cameraCarouselThumbnail: _images[1],
    clue: {
      answer: "test 1",
      description: "test 1",
      image: _images[1],
      name: "test 1",
      question: "test 1 question",
      type: "bool",
    },
  },
  {
    VideoUrl: _images[2],
    videoThumbnail: _images[2],
    cameraCarouselThumbnail: _images[2],
    clue: {
      answer: "test 2",
      description: "test 2",
      image: _images[2],
      name: "test 2",
      question: "test 2 question",
      type: "bool",
    },
  },
  {
    VideoUrl: _images[3],
    videoThumbnail: _images[3],
    cameraCarouselThumbnail: _images[3],
    clue: {
      answer: "test 3",
      description: "test 3",
      image: _images[3],
      name: "test 3",
      question: "test 3 question",
      type: "bool",
    },
  },
  {
    VideoUrl: _images[4],
    videoThumbnail: _images[4],
    cameraCarouselThumbnail: _images[4],
    clue: {
      answer: "test 4",
      description: "test 4",
      image: _images[4],
      name: "test 4",
      question: "test 4 question",
      type: "bool",
    },
  },
  {
    VideoUrl: _images[5],
    videoThumbnail: _images[5],
    cameraCarouselThumbnail: _images[5],
    clue: {
      answer: "test 5",
      description: "test 5",
      image: _images[5],
      name: "test 5",
      question: "test 5 question",
      type: "bool",
    },
  },
  {
    VideoUrl: _images[6],
    videoThumbnail: _images[6],
    cameraCarouselThumbnail: _images[6],
    clue: {
      answer: "test 6",
      description: "test 6",
      image: _images[6],
      name: "test 6",
      question: "test 6 question",
      type: "bool",
    },
  },
  {
    VideoUrl: _images[7],
    videoThumbnail: _images[7],
    cameraCarouselThumbnail: _images[7],
    clue: {
      answer: "test 7",
      description: "test 7",
      image: _images[7],
      name: "test 7",
      question: "test 7 question",
      type: "bool",
    },
  },
];

//interface ClueQuestion {}
