export default {
  mounted(el, binding) {
    const { value } = binding;

    const options = {
      html: value,
    };

    window.M.Tooltip.init(el, options);
  },

  beforeUnmount(el) {
    const tooltip = window.M.Tooltip.getInstance(el);

    if (tooltip?.destroy) tooltip.destroy();
  },
};

// export default (el, binding) => {
//   const { value } = binding;

//   const options = {
//     html: value,
//   };

//   window.M.Tooltip.init(el, options);
// };