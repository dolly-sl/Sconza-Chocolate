var boostPFSIntegrationTemplate = {
   compileTemplate: {
     reviews: "var itemReviewsHtml = '<span class=\"stamped-product-reviews-badge\" data-id=\"' + data.id + '\" data-product-title=\"' + data.title + '\" data-product-sku=\"' + data.skus[0] + '\"></span>';itemHtml = itemHtml.replace(/{{itemReviews}}/g, itemReviewsHtml);"
   },
   call3rdFunction: {
     reviews: "if (typeof StampedFn !== 'undefined' && typeof StampedFn.loadBadges == 'function') {  StampedFn.loadBadges();}"
   }
 };