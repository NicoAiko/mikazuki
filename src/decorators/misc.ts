import { createDecorator } from 'vue-class-component';

export const isMobile = (options: { iPadMobile: boolean } | undefined) => {
  const iPadMobile = options?.iPadMobile ?? false;
  return createDecorator((options, key) => {
    // removed iPad
    ((options.computed ??= {}) as any)[key] = {
      get: () =>
        new RegExp(`Android|webOS|iPhone|iPod${iPadMobile ? '|iPad' : ''}|BlackBerry|IEMobile|Opera Mini`, 'i').test(
          navigator.userAgent
        ),
      set: () => {},
    };
  });
};
