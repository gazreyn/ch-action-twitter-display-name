module.exports = class extends window.casthub.card.action {

    /**
     * Called once when the Action is booted on App
     * launch or when installed for the first time.
     *
     * @return {Promise}
     */
    async mounted() {
        //

        this.twitterData = {
            name: null,
        };

        await super.mounted();
    }

    /**
     * Called when a Trigger has executed and all Conditions have passed.
     *
     * @param {Object} input The output, if any, from the Trigger.
     */
    async run(input) {
        console.log("Running...");
        //

        const { identity } = this.identity;

        const response = await window.casthub.fetch({
            integration: 'twitter',
            method: 'GET',
            url: 'users/show',
            data: {
                user_id: identity,
            }
        });

        console.log(response);

        const request = await window.casthub.fetch({
            identity,
            integration: 'twitter',
            method: 'POST',
            url: 'account/update_profile',
            forceUrlQuery: true,
            data: {
                name: this.template(this.props.displayName, response),
            }
        }); 

        // TODO: Update this to throw new Error when change is made.
        return !request.errors; //If it has errors, return false. Other 
    }

    /**
     * @return {Promise}
     */
    async prepareProps() {
        return {
            displayName: {
                type: 'text',
                required: true,
                default: '🔴LIVE {{name}}',
                label: 'Name Template',
            },
        };
    }

};
