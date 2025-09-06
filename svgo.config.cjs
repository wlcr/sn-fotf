module.exports = {
  plugins: [
    // Enable built-in plugins
    'preset-default',
    
    // Additional optimizations
    {
      name: 'removeViewBox',
      active: false, // Keep viewBox for responsive SVGs
    },
    {
      name: 'removeDimensions',
      active: true, // Remove width/height to make SVGs responsive
    },
    {
      name: 'removeTitle',
      active: false, // Keep titles for accessibility
    },
    {
      name: 'removeDesc',
      active: false, // Keep descriptions for accessibility
    },
    {
      name: 'removeUselessStrokeAndFill',
      active: true,
    },
    {
      name: 'removeEmptyAttrs',
      active: true,
    },
    {
      name: 'removeUnusedNS',
      active: true,
    },
    {
      name: 'removeEditorsNSData',
      active: true,
    },
    {
      name: 'removeEmptyText',
      active: true,
    },
    {
      name: 'removeEmptyContainers',
      active: true,
    },
    {
      name: 'cleanupNumericValues',
      active: true,
      params: {
        floatPrecision: 2, // Reduce decimal precision for smaller file sizes
      },
    },
    {
      name: 'cleanupListOfValues',
      active: true,
      params: {
        floatPrecision: 2,
      },
    },
    {
      name: 'convertColors',
      active: true,
      params: {
        currentColor: false, // Don't convert colors to currentColor
        names2hex: true,     // Convert color names to hex
        rgb2hex: true,       // Convert rgb() to hex
        shorthex: true,      // Use short hex when possible
      },
    },
    {
      name: 'minifyStyles',
      active: true,
    },
    {
      name: 'sortAttrs',
      active: true, // Sort attributes for better compression
    },
    {
      name: 'mergePaths',
      active: true, // Merge multiple paths when possible
    },
    {
      name: 'convertShapeToPath',
      active: true, // Convert simple shapes to paths for smaller size
    },
  ],
  
  // Multipass for better optimization
  multipass: true,
  
  // Pretty print for debugging (set to false for production)
  js2svg: {
    indent: 2,
    pretty: false, // Minified output for smaller files
  },
};
