import { Link } from 'react-router-dom';
import { Gift, Heart, Palette, Sparkles, Award, MessageCircle, ArrowLeft } from 'lucide-react';
import { STORE_CONFIG } from '@/data/store';
import { buildWhatsAppUrl } from '@/utils/whatsapp';
import Breadcrumbs from '@/components/Breadcrumbs';

const VALUES = [
  {
    icon: Gift,
    title: 'فكرة المتجر',
    description: 'في لمسة هدية نؤمن أن الهدية ليست مجرد شيء يُقدّم، بل رسالة ومشاعر وذكرى تبقى. لذلك نسعى لتقديم هدايا فريدة تعبّر عن ما يعجز الكلام عن التعبير عنه.',
  },
  {
    icon: Award,
    title: 'جودة المنتجات',
    description: 'نختار كل منتج بعناية فائقة من أجود المصادر، لنضمن لكم جودة عالية تستحق مناسباتكم المميزة. كل تفصيلة في منتجاتنا مدروسة بعناية.',
  },
  {
    icon: Palette,
    title: 'التخصيص',
    description: 'نقدم لكم إمكانية تخصيص الهدايا بالأسماء والرسائل وألوان التغليف، لتكون هديتك فريدة تمامًا وتحمل لمستك الشخصية الخاصة.',
  },
  {
    icon: Sparkles,
    title: 'الاهتمام بالتفاصيل',
    description: 'من اختيار المنتج إلى التغليف والتوصيل، نهتم بأدق التفاصيل لنضمن لكم تجربة استثنائية تليق بمن تحبون.',
  },
  {
    icon: MessageCircle,
    title: 'خدمة العملاء',
    description: 'فريقنا متاح عبر واتساب لمساعدتكم في اختيار الهدية المثالية وتخصيصها. نحن هنا لخدمتكم في كل خطوة.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container-lux">
        <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'من نحن' }]} />

        {/* Hero */}
        <div className="my-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-700 mb-3">من نحن</h1>
          <p className="text-brown-400 text-lg max-w-2xl">
            في لمسة هدية نؤمن أن الهدية ليست مجرد شيء يُقدّم، بل رسالة ومشاعر وذكرى تبقى.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-12 shadow-lg">
          <img
            src="https://images.pexels.com/photos/5485173/pexels-photo-5485173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="لمسة هدية"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-cream-50 mb-2">{STORE_CONFIG.name}</h2>
            <p className="text-cream-200/90 text-base sm:text-lg">{STORE_CONFIG.tagline}</p>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-brown-500 leading-relaxed text-lg">
            بدأت رحلة لمسة هدية من شغف بسيط بجمال الهدايا وقيمتها المعنوية. نؤمن أن الهدية الحقيقية ليست في قيمتها
            المادية، بل في المشاعر التي تحملها والذكرى التي تخلقها. لذلك نسعى دائمًا لتقديم تشكيلة فاخرة ومميزة من
            الهدايا التي تناسب كل المناسبات، مع إمكانية تخصيصها لتكون فريدة تمامًا.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="card-lux p-6">
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mb-4">
                  <Icon className="text-gold-500" size={24} />
                </div>
                <h3 className="font-bold text-brown-700 text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-brown-400 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: '+500', label: 'عميل سعيد' },
            { value: '+1000', label: 'هدية تم تقديمها' },
            { value: '10', label: 'تصنيفات متنوعة' },
            { value: '4.9', label: 'تقييم العملاء' },
          ].map((stat) => (
            <div key={stat.label} className="bg-cream-100 rounded-2xl p-6 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gold-600 mb-1">{stat.value}</p>
              <p className="text-sm text-brown-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-brown-600 to-brown-500 p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <Heart className="text-gold-300 mx-auto mb-4" size={32} />
            <h2 className="text-2xl font-bold text-cream-50 mb-3">لنجعل مناسبتك ذكرى لا تُنسى</h2>
            <p className="text-cream-200/80 mb-6 max-w-xl mx-auto">
              تواصل معنا الآن وسنساعدك في اختيار أو تصميم الهدية المثالية.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products" className="btn-gold">
                <ArrowLeft size={18} />
                تصفح المنتجات
              </Link>
              <a
                href={buildWhatsAppUrl('مرحبا، أريد الاستفسار عن هدية')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle size={18} />
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
