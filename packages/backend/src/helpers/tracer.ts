import tracer from 'dd-trace'

import appConfig from '@/config/app'

import logger from './logger'

tracer.init({
  logInjection: true,
  service: 'plumber',
  logger,
  env: appConfig.appEnv,
  dbmPropagationMode: 'full',
})

export default tracer
