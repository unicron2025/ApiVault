const Api = require("../models/api.js");



exports.createApi = async (req, res) => {
    try {

            console.log("CreateApi controller Called");


        const { name, baseUrl, docsUrl, category, description} = req.body;

        if( !name|| !baseUrl || !docsUrl || !category || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingApi = await Api.findOne({owner: req.user._id, baseUrl });
        if (existingApi) {
            return res.status(409).json({ message: 'API with this baseUrl already exists' });
        }
                    
        
         const api = new Api({
            name,
            baseUrl,
            docsUrl,
            category,
            description,
            owner: req.user._id
        });
        await api.save();
        return res.status(201).json({ message: 'API created successfully', api });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }

}

exports.getApis = async (req, res) => {
    try {
        const apis = await Api.find({owner: req.user._id});
        return res.status(200)
            .json({ apis });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.patchApi = async (req, res) => {
    try {
        console.log("PatchApi controller Called");
        const { id } = req.params;
        const {name, baseUrl, docsUrl, category, description} = req.body;

        if (!name && !baseUrl && !docsUrl && !category && !description) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }

        const api = await Api.findOne({ _id: id, owner: req.user._id });
        if (!api) {
            return res.status(404).json({ message: 'API not found' });
        }

        // Update the API fields
        if (name !== undefined) api.name = name;
        if (docsUrl !== undefined) api.docsUrl = docsUrl;
        if (category !== undefined) api.category = category;
        if (description !== undefined) api.description = description;
       
        if (baseUrl !== undefined) {

            const duplicate = await Api.findOne({
                owner: req.user._id,
                baseUrl
            });

        if (duplicate && duplicate._id.toString() !== api._id.toString()) {
                return res.status(409).json({
                    message: "Base URL already exists."
                });
            }

        api.baseUrl = baseUrl;
}

        await api.save();
        return res.status(200).json({ message: 'API updated successfully', api });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteApi = async (req, res) => {
    try {
        const { id } = req.params;
        const api = await Api.findOneAndDelete({ _id: id, owner: req.user._id });
        if (!api) {
            return res.status(404).json({message: 'API not found'});
        }
        return res.status(200).json({message: 'Api deleted successfully'});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});

    }
    }

exports.toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;

        const api = await Api.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!api) {
            return res.status(404).json({
                message: "API not found"
            });
        }

        api.favourite = !api.favourite;
        
        await api.save();

        console.log(`API favourite status toggled to: ${api.favourite}`);

        return res.status(200).json({
            message: "API favourite status updated",
            api
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

    exports.searchApis = async (req, res) => {
        try {
            
            const {query} = req.query;
            console.log("Search query:", query);
            if(!query) {
                const apis = await Api.find({owner: req.user._id});
                return res.status(200).json({apis});
            }
            const apis = await Api.aggregate([
                        {
                            $search: {
                            index: "Api_Search",
                            autocomplete: {
                                query: query,
                                path: "name"
                            }
                            }
                        },
                        {
                            $match: {
                            owner: req.user._id
                            }
                        }
                        ]);

            return res.status(200).json({apis});

        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Server error"});
        }
    }
