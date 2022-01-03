module.exports = {
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader"
                }
            },
	    {
		test: /\.(c|sa|sc)ss$/,
		    use: [
		    "style-loader",
		    "css-loader",
		    "sass-loader"
		    ]
	    }
        ]
    }
}
