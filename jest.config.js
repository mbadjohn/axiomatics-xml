module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest" // Transpile all js, ts, jsx, and tsx files
    },
    testEnvironment: 'node',
    transformIgnorePatterns: ['node_modules/(?!(react-d3-tree)/)'], // Transpile react-d3-tree
};