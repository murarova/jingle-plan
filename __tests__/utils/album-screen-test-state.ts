const defaultState = {
  carouselRef: { current: null },
  carouselSize: { width: 0, height: 0 },
  photos: null as unknown[] | null,
  currentMonth: "Рік",
  handleCarouselLayout: jest.fn(),
  handleForward: jest.fn(),
  handleBack: jest.fn(),
  handleSnapToItem: jest.fn(),
};

let albumScreenState = { ...defaultState };

export const getAlbumScreenState = () => albumScreenState;

export const setAlbumScreenState = (partial: Partial<typeof defaultState>) => {
  albumScreenState = { ...albumScreenState, ...partial };
};

export const resetAlbumScreenState = () => {
  albumScreenState = {
    ...defaultState,
    handleCarouselLayout: jest.fn(),
    handleForward: jest.fn(),
    handleBack: jest.fn(),
    handleSnapToItem: jest.fn(),
  };
};
