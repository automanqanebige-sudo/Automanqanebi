import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // აქ ჩამოწერე ყველა ენა, რომელსაც საიტი მხარს უჭერს
  locales: ['ka', 'en', 'ru'],
 
  // ენა, რომელიც ავტომატურად ჩაირთვება (მაგალითად, ქართული)
  defaultLocale: 'ka',

  // ეს უზრუნველყოფს, რომ მთავარ გვერდზე (/) შესვლისას 
  // ავტომატურად გადავიდეს /ka-ზე
  localePrefix: 'always'
});
 
export const config = {
  // ეს "მატჩერი" ეუბნება Next.js-ს, რომელ მისამართებზე იმუშაოს Middleware-მა.
  // ის გამორიცხავს სტატიკურ ფაილებს (სურათები, favicon და ა.შ.)
  matcher: [
    // ყველა გვერდი, რომელიც იწყება ენის კოდით
    '/', 
    '/(ka|en|ru)/:path*',
    
    // გამოვრიცხოთ სისტემური ფაილები
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
