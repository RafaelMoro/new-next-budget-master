export const DEFAULT_AMOUNT_VALUE = '$0.00'

// Backend routes

// Routes
export const LOGIN_ROUTE = '/';
export const FORGOT_PASSWORD_ROUTE = '/forgot-password';
export const REGISTER_ROUTE = '/register';
export const DASHBOARD_ROUTE = '/dashboard';
export const CREATE_RECORD_ROUTE = '/create-record';
export const EDIT_EXPENSE_PAGE_ROUTE = '/edit-record/edit-expense'
export const EDIT_INCOME_PAGE_ROUTE = '/edit-record/edit-income'
export const EDIT_TRANSFER_PAGE_ROUTE = '/edit-record/edit-transfer'

// API Endpoints
export const LOGIN_API_ENDPOINT = '/api';
export const CREATE_USER_API_ENDPOINT = '/api/users/create-user';
export const FORGOT_PASSWORD_API_ENDPOINT = '/api/users/forgot-password';
export const RESET_PASSWORD_API_ENDPOINT = '/api/users/reset-password';
export const ACCOUNT_API_ENDPOINT = 'api/accounts'
export const EXPENSE_API_ENDPOINT = '/api/records/expense'
export const INCOME_API_ENDPOINT = '/api/records/income'
export const RECORDS_API_ENDPOINT = '/api/records'
export const SAVE_SELECTED_ACCOUNT_API_ENDPOINT = '/api/preferences/selected-account'

// Cookies
export const THEME_COOKIE_KEY = 'theme-budget-master'
export const SESSION_COOKIE_KEY = 'session-budget-master'
  // Stands for fintrack selected bank account
export const ACCOUNT_COOKIE_KEY = 'ftk_sba'
export const DASHBOARD_SCREEN_KEY = 'dashboard_screen'
export const OVERVIEW_SUBSCREEN_KEY = 'overview_subscreen'

// Errors from backend
export const ERROR_CONNECTION = 'ECONNREFUSED'

// Errors to show in the UI
export const GENERAL_ERROR_MESSAGE = 'Oops! Algo no salió como esperabamos.';
export const ERROR_CONNECTION_MESSAGE = 'Hubo un error con tu red. Revisa tu conexión a internet e intenta nuevamente.'

// Tags
export const LAST_MONTH_RECORDS_TAG = 'last-month-records'
export const OLDER_RECORDS_TAG = 'older-records'