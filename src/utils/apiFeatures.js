class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Handle due date range filters (dueBefore, dueAfter)
        if (queryObj.dueBefore || queryObj.dueAfter) {
            queryObj.dueDate = {};
            if (queryObj.dueBefore) queryObj.dueDate.$lte = new Date(queryObj.dueBefore);
            if (queryObj.dueAfter) queryObj.dueDate.$gte = new Date(queryObj.dueAfter);
            delete queryObj.dueBefore;
            delete queryObj.dueAfter;
        }

        // Handle tag filtering
        if (queryObj.tag) {
            queryObj.tags = queryObj.tag;
            delete queryObj.tag;
        }

        this.query = this.query.find(queryObj);
        return this;
    }

    search() {
        if (this.queryString.search) {
            this.query = this.query.find({ $text: { $search: this.queryString.search } });
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
        this.query = this.query.sort('-createdAt'); // Default sort by newest
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page, 10) || 1;
        // Max limit is 100
        const limit = Math.min(parseInt(this.queryString.limit, 10) || 10, 100); 
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;