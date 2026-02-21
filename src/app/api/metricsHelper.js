import { requestDuration, requestErrors, routeHits, dbQueryDuration, dbOperationsTotal } from './metrics';

/**
 * Helper function to track metrics for API routes
 * Usage: const result = await trackMetrics(routeName, method, async () => { your logic });
 */
export async function trackMetrics(route, method, handler) {
  const start = Date.now();
  
  try {
    // Increment total requests counter
    routeHits.inc({ route, method });
    
    // Execute handler
    const result = await handler();
    
    // Track request duration
    const duration = (Date.now() - start) / 1000;
    requestDuration.observe({ route, method }, duration);
    
    return result;
  } catch (error) {
    // Track errors
    requestErrors.inc({ route, method, status: error.status || 500 });
    
    // Track request duration even for errors
    const duration = (Date.now() - start) / 1000;
    requestDuration.observe({ route, method }, duration);
    
    throw error;
  }
}

/**
 * Helper function to track MongoDB operations
 * Usage: const result = await trackDbOperation('find', 'users', async () => { await User.find() });
 */
export async function trackDbOperation(operation, collection, handler) {
  const start = Date.now();
  
  try {
    // Increment operation counter
    dbOperationsTotal.inc({ operation, collection });
    
    // Execute the database operation
    const result = await handler();
    
    // Track query duration
    const duration = (Date.now() - start) / 1000;
    dbQueryDuration.observe({ operation, collection }, duration);
    
    return result;
  } catch (error) {
    // Track query duration even for errors
    const duration = (Date.now() - start) / 1000;
    dbQueryDuration.observe({ operation, collection }, duration);
    
    throw error;
  }
}
