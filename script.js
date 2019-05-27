Vue.component('star-rating', VueStarRating.default);
let app = new Vue({
	el: '#app',
	data: 
	{
		foundMaxNumber: false,
		maxNumber: '',
		number: '',
		current: 
		{
			title:'',
			img: '',
			alt: '',
			month: ''
		},
		loading: true,
		addedName: '',
    	addedComment: '',
    	addedTime: '',
    	comments: {},
    	ratings: {}
	},

	created()
	{
		this.xkcd();
	},

	methods:
	{
		async xkcd()
		{
			try
			{
				const response = await axios.get('https://xkcd.now.sh/' + this.number);
				console.log("response: ", response);
				this.current = response.data;
				this.loading = false;
				this.number = response.data.num;
				if (this.foundMaxNumber === false)
				{
					this.maxNumber = response.data.num;
					this.foundMaxNumber = true;
				}
				return true;
			}
			catch(error)
			{
				console.log(error)
				this.loading = false;
			}
		},
		previousComic()
		{
			this.number = this.current.num - 1;
			if (this.number <= 0)
			{
				this.number = this.maxNumber;
			}
		},
		nextComic()
		{
			this.number = this.current.num + 1;
			if (this.number >= this.maxNumber)
			{
				this.number = 1;
			}
		},
		randomComic()
		{
      		this.number = Math.floor(Math.random() * (this.maxNumber - 1));
		},
		firstComic()
		{
			this.number = 1;
		},
		lastComic()
		{
			this.number = this.maxNumber;
		},
		addComment()
		{
			if (!(this.number in this.comments))
			{
        		Vue.set(app.comments, this.number, new Array);
        	}
        	this.addedTime = moment().format('MMMM Do YYYY, h:mm a');
		    this.comments[this.number].push({
		        author: this.addedName,
		        text: this.addedComment,
		        time: this.addedTime
		    });
		    this.addedName = '';
		    this.addedComment = '';
		},
		setRating(rating)
		{
			if (!(this.number in this.ratings))
			{
        		Vue.set(this.ratings, this.number, 
        		{
          			sum: 0,
          			total: 0
        		});
        	}
      		this.ratings[this.number].sum += rating;
     		this.ratings[this.number].total += 1;
		}
	},
	computed:
	{
		month()
		{
			var month = new Array;
			if (this.current.month === undefined)
			{
				return "";
			}
			month[0] = "January";
			month[1] = "February";
			month[2] = "March";
			month[3] = "April";
			month[4] = "May";
			month[5] = "June";
			month[6] = "July";
			month[7] = "August";
			month[8] = "September";
			month[9] = "October";
			month[10] = "November";
			month[11] = "December";
			return month[this.current.month - 1];
		},
		rating()
		{
			if (!(this.number in this.ratings))
			{
        		Vue.set(this.ratings, this.number, 
        		{
          			sum: 0,
          			total: 0
        		});
        	}
        	var averageRating = (this.ratings[this.number].sum / this.ratings[this.number].total);
        	if (averageRating !== averageRating) //Testing if averageRating is dividing by 0.
        	{
        		return "No ratings yet";
        	}
			return averageRating.toPrecision(2);
		}
	},

	watch: 
	{
    	number(value, oldvalue) 
    	{
      		this.xkcd();
    	},
  	}
	
})