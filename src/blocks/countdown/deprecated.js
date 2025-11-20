/**
 * BLOCK: Kadence Countdown
 */

/**
 * Import External
 */
import classnames from 'classnames';

const { InnerBlocks, useBlockProps } = wp.blockEditor;

export default [
	{
		attributes: {
			"uniqueID": {
                "type": "string",
                "default": ""
            },
            "countdownType": {
                "type": "string",
                "default": "date"
            },
            "date": {
                "type": "string",
                "default": ""
            },
            "endDate": {
                "type": "string",
                "default": ""
            },
            "timezone": {
                "type": "string",
                "default": ""
            },
            "timestamp": {
                "type": "number",
                "default": ""
            },
            "timeOffset": {
                "type": "number",
                "default": ""
            },
            "expireAction": {
                "type": "string",
                "default": "none"
            },
            "redirectURL": {
                "type": "string",
                "default": ""
            },
            "campaignID": {
                "type": "string"
            },
            "evergreenHours": {
                "type": "number",
                "default": 0
            },
            "evergreenMinutes": {
                "type": "number",
                "default": 0
            },
            "evergreenReset": {
                "type": "number",
                "default": 30
            },
            "evergreenStrict": {
                "type": "boolean",
                "default": false
            },
            "repeat": {
                "type": "boolean",
                "default": false
            },
            "stopRepeating": {
                "type": "boolean",
                "default": false
            },
            "frequency": {
                "type": "string",
                "default": "daily"
            },
            "enableTimer": {
                "type": "boolean",
                "default": true
            },
            "revealOnLoad": {
                "type": "boolean",
                "default": false
            },
            "units": {
                "type": "array",
                "default": [
                    {
                        "days": true,
                        "hours": true,
                        "minutes": true,
                        "seconds": true
                    }
                ]
            },
            "timerLayout": {
                "type": "string",
                "default": "block"
            },
            "timeNumbers": {
                "type": "boolean",
                "default": false
            },
            "countdownDivider": {
                "type": "boolean",
                "default": false
            },
            "preLabel": {
                "type": "string",
                "default": ""
            },
            "postLabel": {
                "type": "string",
                "default": ""
            },
            "daysLabel": {
                "type": "string",
                "default": ""
            },
            "hoursLabel": {
                "type": "string",
                "default": ""
            },
            "minutesLabel": {
                "type": "string",
                "default": ""
            },
            "secondsLabel": {
                "type": "string",
                "default": ""
            },
            "numberColor": {
                "type": "string"
            },
            "numberFont": {
                "type": "array",
                "default": [
                    {
                        "size": ["", "", ""],
                        "sizeType": "px",
                        "lineHeight": ["", "", ""],
                        "lineType": "px",
                        "letterSpacing": ["", "", ""],
                        "letterType": "px",
                        "textTransform": "",
                        "family": "",
                        "google": false,
                        "style": "",
                        "weight": "",
                        "variant": "",
                        "subset": "",
                        "loadGoogle": true
                    }
                ]
            },
            "itemBackground": {
                "type": "string",
                "default": ""
            },
            "itemBorder": {
                "type": "string",
                "default": ""
            },
            "itemBorderWidth": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "itemTabletBorderWidth": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "itemMobileBorderWidth": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "itemBorderRadius": {
                "type": "array",
                "default": [0, 0, 0, 0]
            },
            "itemPaddingType": {
                "type": "string",
                "default": "px"
            },
            "itemPadding": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "itemTabletPadding": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "itemMobilePadding": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "labelColor": {
                "type": "string"
            },
            "labelFont": {
                "type": "array",
                "default": [
                    {
                        "size": ["", "", ""],
                        "sizeType": "px",
                        "lineHeight": ["", "", ""],
                        "lineType": "px",
                        "letterSpacing": ["", "", ""],
                        "letterType": "px",
                        "textTransform": "",
                        "family": "",
                        "google": false,
                        "style": "",
                        "weight": "",
                        "variant": "",
                        "subset": "",
                        "loadGoogle": true
                    }
                ]
            },
            "preLabelColor": {
                "type": "string"
            },
            "preLabelFont": {
                "type": "array",
                "default": [
                    {
                        "size": ["", "", ""],
                        "sizeType": "px",
                        "lineHeight": ["", "", ""],
                        "lineType": "px",
                        "letterSpacing": ["", "", ""],
                        "letterType": "px",
                        "textTransform": "",
                        "family": "",
                        "google": false,
                        "style": "",
                        "weight": "",
                        "variant": "",
                        "subset": "",
                        "loadGoogle": true
                    }
                ]
            },
            "postLabelColor": {
                "type": "string"
            },
            "postLabelFont": {
                "type": "array",
                "default": [
                    {
                        "size": ["", "", ""],
                        "sizeType": "px",
                        "lineHeight": ["", "", ""],
                        "lineType": "px",
                        "letterSpacing": ["", "", ""],
                        "letterType": "px",
                        "textTransform": "",
                        "family": "",
                        "google": false,
                        "style": "",
                        "weight": "",
                        "variant": "",
                        "subset": "",
                        "loadGoogle": true
                    }
                ]
            },
            "counterAlign": {
                "type": "array",
                "default": ["", "", ""]
            },
            "border": {
                "type": "string",
                "default": ""
            },
            "borderWidth": {
                "type": "array",
                "default": [0, 0, 0, 0]
            },
            "tabletBorderWidth": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "mobileBorderWidth": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "borderRadius": {
                "type": "array",
                "default": [0, 0, 0, 0]
            },
            "background": {
                "type": "string",
                "default": ""
            },
            "paddingType": {
                "type": "string",
                "default": "px"
            },
            "containerPadding": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "containerTabletPadding": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "containerMobilePadding": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "marginType": {
                "type": "string",
                "default": "px"
            },
            "containerMargin": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "containerTabletMargin": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "containerMobileMargin": {
                "type": "array",
                "default": ["", "", "", ""]
            },
            "vsdesk": {
                "type": "boolean",
                "default": false
            },
            "vstablet": {
                "type": "boolean",
                "default": false
            },
            "vsmobile": {
                "type": "boolean",
                "default": false
            },
		},
		save: ({ attributes }) => {
			const {
				uniqueID,
				vsdesk,
				vstablet,
				vsmobile,
				timerLayout,
				countdownDivider,
				enableTimer,
				counterAlign,
				revealOnLoad,
			} = attributes;
			const classes = classnames({
				'kb-countdown-container': true,
				[`kb-countdown-container-${uniqueID}`]: uniqueID,
				[`kb-countdown-timer-layout-${timerLayout}`]: enableTimer && timerLayout,
				'kb-countdown-has-timer': enableTimer,
				'kb-countdown-reveal-on-load': revealOnLoad,
				'kb-countdown-enable-dividers': 'inline' !== timerLayout && countdownDivider && enableTimer,
				[`kb-countdown-align-${counterAlign[0]}`]:
					undefined !== counterAlign && undefined !== counterAlign[0] && enableTimer ? counterAlign[0] : false,
				[`kb-countdown-align-tablet-${counterAlign[1]}`]:
					undefined !== counterAlign && undefined !== counterAlign[1] && enableTimer ? counterAlign[1] : false,
				[`kb-countdown-align-mobile-${counterAlign[2]}`]:
					undefined !== counterAlign && undefined !== counterAlign[2] && enableTimer ? counterAlign[2] : false,
				'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
				'kvs-md-false': vstablet !== 'undefined' && vstablet,
				'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
			});

			const blockProps = useBlockProps.save({
				className: classes,
			});

			return (
				<div {...blockProps} data-id={uniqueID}>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
];

