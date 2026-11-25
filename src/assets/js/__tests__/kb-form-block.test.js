/* eslint-env jest */
// cSpell:ignore grecaptcha
/**
 * Tests for the classic Form block front-end script's reCAPTCHA v3 token handling.
 */
const SCRIPT = '../kb-form-block.js';

/**
 * Render a classic form, load the script, and capture outgoing requests.
 *
 * @param {Object|undefined} grecaptcha The grecaptcha mock, or undefined for none.
 * @param {string}           tokenField The hidden token field markup.
 *
 * @since TBD
 *
 * @return {Object} The form and the list of sent request bodies.
 */
function setup(
	grecaptcha,
	tokenField = '<input type="hidden" name="recaptcha_response" class="kb_recaptcha_response kb_recaptcha_1" value="stale-token" />'
) {
	document.body.innerHTML = `
		<form class="kb-form">
			<input type="text" name="kb_field_0" data-type="text" data-required="yes" value="Jane" />
			${tokenField}
			<button type="submit" class="kb-forms-submit">Submit</button>
		</form>`;

	const sent = [];
	window.XMLHttpRequest = jest.fn().mockImplementation(() => ({
		open: jest.fn(),
		setRequestHeader: jest.fn(),
		send(body) {
			sent.push(new URLSearchParams(body));
		},
	}));
	window.kadence_blocks_form_params = {
		ajaxurl: '/wp-admin/admin-ajax.php',
		nonce: 'nonce',
		recaptcha_site_key: 'site-key',
	};
	if (grecaptcha) {
		window.grecaptcha = grecaptcha;
	}
	jest.isolateModules(() => require(SCRIPT));

	return { form: document.querySelector('form'), sent };
}

/**
 * Submit a form and let pending promises settle.
 *
 * @param {HTMLFormElement} form The form to submit.
 *
 * @since TBD
 *
 * @return {Promise} Resolves once the submit handler has finished.
 */
async function submit(form) {
	form.dispatchEvent(new Event('submit', { cancelable: true }));
	await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('kb-form-block reCAPTCHA v3', () => {
	afterEach(() => {
		delete window.kadenceForm;
		delete window.grecaptcha;
		delete window.kadence_blocks_form_params;
	});

	it('requests a fresh token at submit time and sends it', async () => {
		const grecaptcha = {
			ready: jest.fn((callback) => callback()),
			execute: jest.fn(() => Promise.resolve('fresh-token')),
		};
		const { form, sent } = setup(grecaptcha);

		await submit(form);

		expect(grecaptcha.execute).toHaveBeenCalledWith('site-key', { action: 'kb_form' });
		expect(sent).toHaveLength(1);
		expect(sent[0].get('recaptcha_response')).toBe('fresh-token');
	});

	it('refreshes the id-only token field from older saved forms', async () => {
		const grecaptcha = {
			ready: jest.fn((callback) => callback()),
			execute: jest.fn(() => Promise.resolve('fresh-token')),
		};
		const { form, sent } = setup(
			grecaptcha,
			'<input type="hidden" name="recaptcha_response" id="kb_recaptcha_response" value="stale-token" />'
		);

		await submit(form);

		expect(sent[0].get('recaptcha_response')).toBe('fresh-token');
	});

	it('gets a new token for each submission', async () => {
		let count = 0;
		const grecaptcha = {
			ready: jest.fn((callback) => callback()),
			execute: jest.fn(() => Promise.resolve('token-' + ++count)),
		};
		const { form, sent } = setup(grecaptcha);

		await submit(form);
		form.querySelector('.kb-forms-submit').removeAttribute('disabled');
		await submit(form);

		expect(sent.map((body) => body.get('recaptcha_response'))).toEqual(['token-1', 'token-2']);
	});

	it('falls back to the existing token when execute fails', async () => {
		const grecaptcha = {
			ready: jest.fn((callback) => callback()),
			execute: jest.fn(() => Promise.reject(new Error('network'))),
		};
		const { form, sent } = setup(grecaptcha);

		await submit(form);

		expect(sent).toHaveLength(1);
		expect(sent[0].get('recaptcha_response')).toBe('stale-token');
	});

	it('submits without reCAPTCHA when the library is not loaded', async () => {
		const { form, sent } = setup();

		await submit(form);

		expect(sent).toHaveLength(1);
		expect(sent[0].get('recaptcha_response')).toBe('stale-token');
	});

	it('does not call reCAPTCHA when validation fails', async () => {
		const grecaptcha = {
			ready: jest.fn((callback) => callback()),
			execute: jest.fn(() => Promise.resolve('fresh-token')),
		};
		const { form, sent } = setup(grecaptcha);
		form.querySelector('[name="kb_field_0"]').value = '';

		await submit(form);

		expect(grecaptcha.execute).not.toHaveBeenCalled();
		expect(sent).toHaveLength(0);
	});
});
