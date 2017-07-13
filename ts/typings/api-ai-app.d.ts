import { Request, Response } from 'express';

import { AssistantApp, DateTime, DeviceLocation, SessionStartedFunction, User } from './assistant-app';
import { Carousel, List, RichResponse, SimpleResponse } from './response-builder';
import { DeliveryAddress, TransactionDecision } from './transactions';

/**
 * This is the class that handles the communication with API.ai's backend..
 */

// ---------------------------------------------------------------------------
//                   API.AI support
// ---------------------------------------------------------------------------

/**
 * API.AI {@link https://docs.api.ai/docs/concept-contexts|Context}.
 */
export interface Context {
  // Full name of the context.
  name: string;
  // Parameters carried within this context.
  // See {@link https://docs.api.ai/docs/concept-actions#section-extracting-values-from-contexts|here}.
  parameters: object;
  // Remaining number of intents
  lifespan: number;
}

export interface ApiAiAppOptions {
  request: Request;
  response: Response;
  sessionStarted?: SessionStartedFunction;
}

/**
 * Constructor for ApiAiApp object. To be used in the API.AI
 * fulfillment webhook logic.
 *
 * @example
 * const ApiAiApp = require('actions-on-google').ApiAiApp;
 * const app = new ApiAiApp({request: request, response: response,
 *   sessionStarted:sessionStarted});
 *
 * @param {Object} options JSON configuration.
 * @param {Object} options.request Express HTTP request object.
 * @param {Object} options.response Express HTTP response object.
 * @param {Function=} options.sessionStarted Function callback when session starts.
 *     Only called if webhook is enabled for welcome/triggering intents, and
 *     called from Web Simulator or Google Home device (i.e., not API.AI simulator).
 * @apiai
 */
export class ApiAiApp extends AssistantApp {
  constructor(options: ApiAiAppOptions);

  /**
   * Gets the {@link User} object.
   * The user object contains information about the user, including
   * a string identifier and personal information (requires requesting permissions,
   * see {@link AssistantApp#askForPermissions|askForPermissions}).
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const userId = app.getUser().userId;
   *
   * @return {User} Null if no value.
   * @apiai
   */
  getUser(): User;

  /**
   * If granted permission to device's location in previous intent, returns device's
   * location (see {@link AssistantApp#askForPermissions|askForPermissions}).
   * If device info is unavailable, returns null.
   *
   * @example
   * const app = new ApiAiApp({request: req, response: res});
   * app.askForPermission("To get you a ride",
   *   app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
   * // ...
   * // In response handler for permissions fallback intent:
   * if (app.isPermissionGranted()) {
   *   sendCarTo(app.getDeviceLocation().coordinates);
   * }
   *
   * @return {DeviceLocation} Null if location permission is not granted.
   * @apiai
   */
  getDeviceLocation(): DeviceLocation;

  /**
   * Gets transactability of user. Only use after calling
   * askForTransactionRequirements. Null if no result given.
   *
   * @return {string} One of Transactions.ResultType.
   * @apiai
   */
  getTransactionRequirementsResult(): string;

  /**
   * Gets order delivery address. Only use after calling askForDeliveryAddress.
   *
   * @return {DeliveryAddress} Delivery address information. Null if user
   *     denies permission, or no address given.
   * @apiai
   */
  getDeliveryAddress(): DeliveryAddress;

  /**
   * Gets transaction decision information. Only use after calling
   * askForTransactionDecision.
   *
   * @return {TransactionDecision} Transaction decision data. Returns object with
   *     userDecision only if user declines. userDecision will be one of
   *     Transactions.ConfirmationDecision. Null if no decision given.
   * @apiai
   */
  getTransactionDecision(): TransactionDecision;

  /**
   * Gets confirmation decision. Use after askForConfirmation.
   *
   * @return {boolean} True if the user replied with affirmative response.
   *     False if user replied with negative response. Null if no user
   *     confirmation decision given.
   * @apiai
   */
  getUserConfirmation(): boolean;

  /**
   * Gets user provided date and time. Use after askForDateTime.
   *
   * @return {DateTime} Date and time given by the user. Null if no user
   *     date and time given.
   * @apiai
   */
  getDateTime(): DateTime;

  /**
   * Gets status of user sign in request.
   *
   * @return {string} Result of user sign in request. One of
   *     ApiAiApp.SignInStatus. Null if no sign in status.
   * @apiai
   */
  getSignInStatus(): string;

  /**
   * Returns true if the request follows a previous request asking for
   * permission from the user and the user granted the permission(s). Otherwise,
   * false. Use with {@link AssistantApp#askForPermissions|askForPermissions}.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * app.askForPermissions("To get you a ride", [
   *   app.SupportedPermissions.NAME,
   *   app.SupportedPermissions.DEVICE_PRECISE_LOCATION
   * ]);
   * // ...
   * // In response handler for permissions fallback intent:
   * if (app.isPermissionGranted()) {
   *  // Use the requested permission(s) to get the user a ride
   * }
   *
   * @return {boolean} True if permissions granted.
   * @apiai
   */
  isPermissionGranted(): boolean;

  /**
   * Returns true if the app is being tested in sandbox mode. Enable sandbox
   * mode in the (Actions console)[console.actions.google.com] to test
   * transactions.
   *
   * @return {boolean} True if app is being used in Sandbox mode.
   * @apiai
   */
  isInSandbox(): boolean;

  /**
   * Verifies whether the request comes from API.AI.
   *
   * @param {string} key The header key specified by the developer in the
   *     API.AI Fulfillment settings of the app.
   * @param {string} value The private value specified by the developer inside the
   *     fulfillment header.
   * @return {boolean} True if the request comes from API.AI.
   * @apiai
   */
  isRequestFromApiAi(key: string, value: string): boolean;

  /**
   * Gets surface capabilities of user device.
   *
   * @return {Array<string>} Supported surface capabilities, as defined in
   *     AssistantApp.SurfaceCapabilities.
   * @apiai
   */
  getSurfaceCapabilities(): string[];

  /**
   * Gets type of input used for this request.
   *
   * @return {number} One of ApiAiApp.InputTypes.
   *     Null if no input type given.
   * @apiai
   */
  getInputType(): number;

  /**
   * Get the current intent. Alternatively, using a handler Map with
   * {@link AssistantApp#handleRequest|handleRequest},
   * the client library will automatically handle the incoming intents.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   *
   * function responseHandler (app) {
   *   const intent = app.getIntent();
   *   switch (intent) {
   *     case WELCOME_INTENT:
   *       app.ask('Welcome to action snippets! Say a number.');
   *       break;
   *
   *     case NUMBER_INTENT:
   *       const number = app.getArgument(NUMBER_ARGUMENT);
   *       app.tell('You said ' + number);
   *       break;
   *   }
   * }
   *
   * app.handleRequest(responseHandler);
   *
   * @return {string} Intent id or null if no value.
   * @apiai
   */
  getIntent(): string;

  /**
   * Get the argument value by name from the current intent. If the argument
   * is included in originalRequest, and is not a text argument, the entire
   * argument object is returned.
   *
   * Note: If incoming request is using an API version under 2 (e.g. 'v1'),
   * the argument object will be in Proto2 format (snake_case, etc).
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const WELCOME_INTENT = 'input.welcome';
   * const NUMBER_INTENT = 'input.number';
   *
   * function welcomeIntent (app) {
   *   app.ask('Welcome to action snippets! Say a number.');
   * }
   *
   * function numberIntent (app) {
   *   const number = app.getArgument(NUMBER_ARGUMENT);
   *   app.tell('You said ' + number);
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(NUMBER_INTENT, numberIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string} argName Name of the argument.
   * @return {Object} Argument value matching argName
   *     or null if no matching argument.
   * @apiai
   */
  getArgument(argName: string): object;

  /**
   * Get the context argument value by name from the current intent. Context
   * arguments include parameters collected in previous intents during the
   * lifespan of the given context. If the context argument has an original
   * value, usually representing the underlying entity value, that will be given
   * as part of the return object.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const WELCOME_INTENT = 'input.welcome';
   * const NUMBER_INTENT = 'input.number';
   * const OUT_CONTEXT = 'output_context';
   * const NUMBER_ARG = 'myNumberArg';
   *
   * function welcomeIntent (app) {
   *   const parameters = {};
   *   parameters[NUMBER_ARG] = '42';
   *   app.setContext(OUT_CONTEXT, 1, parameters);
   *   app.ask('Welcome to action snippets! Ask me for your number.');
   * }
   *
   * function numberIntent (app) {
   *   const number = app.getContextArgument(OUT_CONTEXT, NUMBER_ARG);
   *   // number === { value: 42 }
   *   app.tell('Your number is  ' + number.value);
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(NUMBER_INTENT, numberIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string} contextName Name of the context.
   * @param {string} argName Name of the argument.
   * @return {Object} Object containing value property and optional original
   *     property matching context argument. Null if no matching argument.
   * @apiai
   */
  getContextArgument(contextName: string, argName: string): object;

  /**
   * Returns the RichResponse constructed in API.AI response builder.
   *
   * @example
   * const app = new App({request: req, response: res});
   *
   * function tellFact (app) {
   *   let fact = 'Google was founded in 1998';
   *
   *   if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
   *     app.ask(app.getIncomingRichResponse().addSimpleResponse('Here\'s a ' +
   *       'fact for you. ' + fact + ' Which one do you want to hear about ' +
   *       'next, Google\'s history or headquarters?'));
   *   } else {
   *     app.ask('Here\'s a fact for you. ' + fact + ' Which one ' +
   *       'do you want to hear about next, Google\'s history or headquarters?');
   *   }
   * }
   *
   * const actionMap = new Map();
   * actionMap.set('tell.fact', tellFact);
   *
   * app.handleRequest(actionMap);
   *
   * @return {RichResponse} RichResponse created in API.AI. If no RichResponse was
   *     created, an empty RichResponse is returned.
   * @apiai
   */
  getIncomingRichResponse(): RichResponse;

  /**
   * Returns the List constructed in API.AI response builder.
   *
   * @example
   * const app = new App({request: req, response: res});
   *
   * function pickOption (app) {
   * if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
   *     app.askWithList('Which of these looks good?',
   *       app.getIncomingList().addItems(
   *         app.buildOptionItem('another_choice', ['Another choice']).
   *         setTitle('Another choice')));
   *   } else {
   *     app.ask('What would you like?');
   *   }
   * }
   *
   * const actionMap = new Map();
   * actionMap.set('pick.option', pickOption);
   *
   * app.handleRequest(actionMap);
   *
   * @return {List} List created in API.AI. If no List was created, an empty
   *     List is returned.
   * @apiai
   */
  getIncomingList(): List;

  /**
   * Returns the Carousel constructed in API.AI response builder.
   *
   * @example
   * const app = new App({request: req, response: res});
   *
   * function pickOption (app) {
   * if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
   *     app.askWithCarousel('Which of these looks good?',
   *       app.getIncomingCarousel().addItems(
   *         app.buildOptionItem('another_choice', ['Another choice']).
   *         setTitle('Another choice').setDescription('Choose me!')));
   *   } else {
   *     app.ask('What would you like?');
   *   }
   * }
   *
   * const actionMap = new Map();
   * actionMap.set('pick.option', pickOption);
   *
   * app.handleRequest(actionMap);
   *
   * @return {Carousel} Carousel created in API.AI. If no Carousel was created,
   *     an empty Carousel is returned.
   * @apiai
   */
  getIncomingCarousel(): Carousel;

  /**
   * Returns the option key user chose from options response.
   *
   * @example
   * const app = new App({request: req, response: res});
   *
   * function pickOption (app) {
   *   if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
   *     app.askWithCarousel('Which of these looks good?',
   *       app.getIncomingCarousel().addItems(
   *         app.buildOptionItem('another_choice', ['Another choice']).
   *         setTitle('Another choice').setDescription('Choose me!')));
   *   } else {
   *     app.ask('What would you like?');
   *   }
   * }
   *
   * function optionPicked (app) {
   *   assistant.ask('You picked ' + app.getSelectedOption());
   * }
   *
   * const actionMap = new Map();
   * actionMap.set('pick.option', pickOption);
   * actionMap.set('option.picked', optionPicked);
   *
   * app.handleRequest(actionMap);
   *
   * @return {string} Option key of selected item. Null if no option selected or
   *     if current intent is not OPTION intent.
   * @apiai
   */
  getSelectedOption(): string;

  /**
   * Asks to collect the user's input.
   *
   * NOTE: Due to a bug, if you specify the no-input prompts,
   * the mic is closed after the 3rd prompt, so you should use the 3rd prompt
   * for a bye message until the bug is fixed.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const WELCOME_INTENT = 'input.welcome';
   * const NUMBER_INTENT = 'input.number';
   *
   * function welcomeIntent (app) {
   *   app.ask('Welcome to action snippets! Say a number.',
   *     ['Say any number', 'Pick a number', 'We can stop here. See you soon.']);
   * }
   *
   * function numberIntent (app) {
   *   const number = app.getArgument(NUMBER_ARGUMENT);
   *   app.tell('You said ' + number);
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(NUMBER_INTENT, numberIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string|SimpleResponse|RichResponse} inputPrompt The input prompt
   *     response.
   * @param {Array<string>=} noInputs Array of re-prompts when the user does not respond (max 3).
   * @return {Object} HTTP response.
   * @apiai
   */
  ask(inputPrompt: string | SimpleResponse | RichResponse, noInputs?: string[]): object;

  /**
   * Asks to collect the user's input with a list.
   *
   * @example
   * const app = new ApiAiApp({request, response});
   * const WELCOME_INTENT = 'input.welcome';
   * const OPTION_INTENT = 'option.select';
   *
   * function welcomeIntent (app) {
   *   app.askWithList('Which of these looks good?',
   *     app.buildList('List title')
   *      .addItems([
   *        app.buildOptionItem(SELECTION_KEY_ONE,
   *          ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'])
   *          .setTitle('Title of First List Item'),
   *        app.buildOptionItem(SELECTION_KEY_TWO,
   *          ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'])
   *          .setTitle('Title of Second List Item'),
   *      ]));
   * }
   *
   * function optionIntent (app) {
   *   if (app.getSelectedOption() === SELECTION_KEY_ONE) {
   *     app.tell('Number one is a great choice!');
   *   } else {
   *     app.tell('Number two is a great choice!');
   *   }
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(OPTION_INTENT, optionIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string|RichResponse|SimpleResponse} inputPrompt The input prompt
   *     response.
   * @param {List} list List built with {@link AssistantApp#buildList|buildList}.
   * @return {Object} HTTP response.
   * @apiai
   */
  askWithList(inputPrompt: string | RichResponse | SimpleResponse, list: List): object;

  /**
   * Asks to collect the user's input with a carousel.
   *
   * @example
   * const app = new ApiAiApp({request, response});
   * const WELCOME_INTENT = 'input.welcome';
   * const OPTION_INTENT = 'option.select';
   *
   * function welcomeIntent (app) {
   *   app.askWithCarousel('Which of these looks good?',
   *     app.buildCarousel()
   *      .addItems([
   *        app.buildOptionItem(SELECTION_KEY_ONE,
   *          ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'])
   *          .setTitle('Number one'),
   *        app.buildOptionItem(SELECTION_KEY_TWO,
   *          ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'])
   *          .setTitle('Number two'),
   *      ]));
   * }
   *
   * function optionIntent (app) {
   *   if (app.getSelectedOption() === SELECTION_KEY_ONE) {
   *     app.tell('Number one is a great choice!');
   *   } else {
   *     app.tell('Number two is a great choice!');
   *   }
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(OPTION_INTENT, optionIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string|RichResponse|SimpleResponse} inputPrompt The input prompt
   *     response.
   * @param {Carousel} carousel Carousel built with
   *     {@link AssistantApp#buildCarousel|buildCarousel}.
   * @return {Object} HTTP response.
   * @apiai
   */
  askWithCarousel(inputPrompt: string | RichResponse | SimpleResponse, carousel: Carousel): object;

  /**
   * Asks user for delivery address.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const WELCOME_INTENT = 'input.welcome';
   * const DELIVERY_INTENT = 'delivery.address';
   *
   * function welcomeIntent (app) {
   *   app.askForDeliveryAddress('To make sure I can deliver to you');
   * }
   *
   * function addressIntent (app) {
   *   const postalCode = app.getDeliveryAddress().postalAddress.postalCode;
   *   if (isInDeliveryZone(postalCode)) {
   *     app.tell('Great looks like you\'re in our delivery area!');
   *   } else {
   *     app.tell('I\'m sorry it looks like we can\'t deliver to you.');
   *   }
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(DELIVERY_INTENT, addressIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string} reason Reason given to user for asking delivery address.
   * @return {Object} HTTP response.
   * @apiai
   */
  askForDeliveryAddress(reason: string): object;

  /**
   * Tells the Assistant to render the speech response and close the mic.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const WELCOME_INTENT = 'input.welcome';
   * const NUMBER_INTENT = 'input.number';
   *
   * function welcomeIntent (app) {
   *   app.ask('Welcome to action snippets! Say a number.');
   * }
   *
   * function numberIntent (app) {
   *   const number = app.getArgument(NUMBER_ARGUMENT);
   *   app.tell('You said ' + number);
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(NUMBER_INTENT, numberIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string|SimpleResponse|RichResponse} textToSpeech Final response.
   *     Spoken response can be SSML.
   * @return The response that is sent back to Assistant.
   * @apiai
   */
  tell(speechResponse: string | SimpleResponse | RichResponse): object;

  /**
   * Set a new context for the current intent.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const CONTEXT_NUMBER = 'number';
   * const NUMBER_ARGUMENT = 'myNumber';
   *
   * function welcomeIntent (app) {
   *   app.setContext(CONTEXT_NUMBER);
   *   app.ask('Welcome to action snippets! Say a number.');
   * }
   *
   * function numberIntent (app) {
   *   const number = app.getArgument(NUMBER_ARGUMENT);
   *   app.tell('You said ' + number);
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(NUMBER_INTENT, numberIntent);
   * app.handleRequest(actionMap);
   *
   * @param {string} name Name of the context. API.AI converts to lowercase.
   * @param {int} [lifespan=1] Context lifespan.
   * @param {Object=} parameters Context JSON parameters.
   * @apiai
   */
  setContext(name: string, lifespan: number, parameters?: object): void;

  /**
   * Returns the incoming contexts for this intent.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * const CONTEXT_NUMBER = 'number';
   * const NUMBER_ARGUMENT = 'myNumber';
   *
   * function welcomeIntent (app) {
   *   app.setContext(CONTEXT_NUMBER);
   *   app.ask('Welcome to action snippets! Say a number.');
   * }
   *
   * function numberIntent (app) {
   *   let contexts = app.getContexts();
   *   // contexts === [{
   *   //   name: 'number',
   *   //   lifespan: 0,
   *   //   parameters: {
   *   //     myNumber: '23',
   *   //     myNumber.original: '23'
   *   //   }
   *   // }]
   *   const number = app.getArgument(NUMBER_ARGUMENT);
   *   app.tell('You said ' + number);
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(NUMBER_INTENT, numberIntent);
   * app.handleRequest(actionMap);
   *
   * @return {Context[]} Empty if no active contexts.
   * @apiai
   */
  getContexts(): Context[];

  /**
   * Returns the incoming context by name for this intent.
   *
   * @example
   * const app = new ApiAiapp({request: request, response: response});
   * const CONTEXT_NUMBER = 'number';
   * const NUMBER_ARGUMENT = 'myNumber';
   *
   * function welcomeIntent (app) {
   *   app.setContext(CONTEXT_NUMBER);
   *   app.ask('Welcome to action snippets! Say a number.');
   * }
   *
   * function numberIntent (app) {
   *   let context = app.getContext(CONTEXT_NUMBER);
   *   // context === {
   *   //   name: 'number',
   *   //   lifespan: 0,
   *   //   parameters: {
   *   //     myNumber: '23',
   *   //     myNumber.original: '23'
   *   //   }
   *   // }
   *   const number = app.getArgument(NUMBER_ARGUMENT);
   *   app.tell('You said ' + number);
   * }
   *
   * const actionMap = new Map();
   * actionMap.set(WELCOME_INTENT, welcomeIntent);
   * actionMap.set(NUMBER_INTENT, numberIntent);
   * app.handleRequest(actionMap);
   *
   * @return {Object} Context value matching name
   *     or null if no matching context.
   * @apiai
   */
  getContext(name: string): object;

  /**
   * Gets the user's raw input query.
   *
   * @example
   * const app = new ApiAiApp({request: request, response: response});
   * app.tell('You said ' + app.getRawInput());
   *
   * @return {string} User's raw query or null if no value.
   * @apiai
   */
  getRawInput(): string;
}

export default ApiAiApp;
