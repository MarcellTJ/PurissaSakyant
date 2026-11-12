import { useContent, useGeneralImage } from '../content.jsx';
import legacyEvent from '../data/legacyEvent.json';
import { Link } from 'react-router-dom';
export function HomeIntro({ imageOverride } = {}) {
  const original = useGeneralImage('home-intro');
  const image = imageOverride || original;
  return (
    <section className="home-intro section">
      <div className="intro-copy">
        <div className="eyebrow">PURISSA SAKYANT · JAKARTA BARAT</div>
        <h1>
          Seni sakral.
          <br />
          Cerita yang
          <br />
          <em>menjadi milikmu.</em>
        </h1>
        <p>
          Kenali Sak Yant, seni tato tradisional Thailand yang mempertemukan
          simbol, aksara, dan makna spiritual dalam setiap garis.
        </p>
        <p>
          Di Purissa, jelajahi karya Sak Yant dan Blessing Saney, pahami
          maknanya, lalu mulai perjalanan Anda melalui konsultasi.
        </p>
        <div className="actions">
          <Link className="button gold" to="/sak-yant">
            Mengenal Sak Yant <span>↗</span>
          </Link>
          <Link className="text-link" to="/gallery">
            Lihat karya <span>↗</span>
          </Link>
        </div>
      </div>
      <div className="intro-visual">
        <img src={image.src} alt={image.alt} />
        <span>{image.caption}</span>
      </div>
    </section>
  );
}
export function Explore() {
  return (
    <section className="explore section">
      <div className="section-top">
        <div>
          <div className="eyebrow">MULAI DARI RASA INGIN TAHU</div>
          <h2>
            Temukan jalan
            <br />
            <em>Anda sendiri.</em>
          </h2>
        </div>
        <p>
          Makna, inspirasi, dan jawaban.
          <br />
          Pilih yang ingin Anda kenali lebih dulu.
        </p>
      </div>
      <div className="explore-grid">
        <Link to="/sak-yant">
          <span>01 / KENALI TRADISINYA</span>
          <h3>Sak Yant & Blessing</h3>
          <p>Pelajari seni, makna, dan pengalaman sebelum memulai.</p>
          <b>Jelajahi maknanya ↗</b>
        </Link>
        <Link to="/gallery">
          <span>02 / TEMUKAN INSPIRASI</span>
          <h3>Karya Purissa</h3>
          <p>Lihat detail, komposisi, dan ragam karya Sak Yant.</p>
          <b>Lihat galeri ↗</b>
        </Link>
        <Link to="/faq">
          <span>03 / PERSIAPKAN DIRI</span>
          <h3>Pertanyaan Anda</h3>
          <p>Dari konsultasi dan teknik hingga proses booking.</p>
          <b>Baca FAQ ↗</b>
        </Link>
      </div>
    </section>
  );
}
export function HomeGallery() {
  const { images } = useContent();
  const gallery = images.filter((image) => image.kind === 'gallery');
  const preferred = [
    '14-full-back-composition',
    '02-tiger-upper-arm',
    '08-radial-geometric-symbols',
  ];
  const previewImages = [
    ...preferred
      .map((id) => gallery.find((image) => image.id === id))
      .filter(Boolean),
    ...gallery.filter((image) => !preferred.includes(image.id)),
  ].slice(0, 3);
  return (
    <section className="home-gallery section">
      <div className="section-top">
        <div>
          <div className="eyebrow">SEKILAS KARYA PURISSA</div>
          <h2>Detail yang bercerita.</h2>
        </div>
        <Link className="text-link" to="/gallery">
          Jelajahi semua karya <span>↗</span>
        </Link>
      </div>
      <div className="preview-grid">
        {previewImages.map((image) => (
          <img key={image.id} src={image.src} alt={image.alt} loading="lazy" />
        ))}
      </div>
    </section>
  );
}
export function InfoIntro() {
  return (
    <section className="page-intro section">
      <div className="eyebrow">MAKNA DI BALIK SETIAP GARIS</div>
      <h1>
        Kenali seninya.
        <br />
        <em>Pahami maknanya.</em>
      </h1>
      <p>
        Sebuah pengantar untuk memahami Sak Yant dan Blessing Saney sebelum
        menentukan perjalanan Anda.
      </p>
    </section>
  );
}
export function Philosophy({ imageOverride } = {}) {
  const original = useGeneralImage('sak-yant-philosophy');
  const image = imageOverride || original;
  return (
    <section className="philosophy section" id="philosophy">
      <div className="ritual-photo">
        <img src={image.src} alt={image.alt} loading="lazy" />
        <span>{image.caption}</span>
      </div>
      <div>
        <div className="eyebrow">ROOTED IN TRADITION</div>
        <h2>
          An ancient art.
          <br />A meaning <em>of your own.</em>
        </h2>
        <p>
          Sak Yant mempertemukan pola geometris, aksara, dan simbol dalam
          tradisi tato sakral. Setiap komposisi membawa cerita dan makna
          tersendiri.
        </p>
        <p>
          Di Purissa, perjalanan dimulai dari percakapan. Kenali desainnya,
          pahami maknanya, dan diskusikan pilihan yang terasa tepat untuk Anda.
        </p>
        <Link className="text-link" to="#process">
          Get to know the process <span>↗</span>
        </Link>
      </div>
    </section>
  );
}
export function Blessing() {
  return (
    <section className="blessing section" id="blessing">
      <div className="blessing-intro">
        <div className="eyebrow">SOLUSI SAKYANT & BLESSING SPECIAL</div>
        <h2>
          Energi baru.
          <br />
          <em>Makna yang mendalam.</em>
        </h2>
        <Link className="text-link" to="#booking">
          Temukan blessing Anda <span>↗</span>
        </Link>
      </div>
      <div className="blessing-list">
        <article>
          <span className="blessing-number">01</span>
          <div>
            <h3>Membuka Jalan Rezeki & Kesuksesan</h3>
            <p>
              Sakyant dapat membantu membuka blok energi, memperlancar usaha,
              dan menarik peluang baru.
            </p>
          </div>
        </article>
        <article>
          <span className="blessing-number">02</span>
          <div>
            <h3>Menarik Energi Cinta & Keharmonisan</h3>
            <p>
              Sakyant & Blessing Saney memperkuat daya tarik personal, membuka
              hati, dan memperbaiki vibrasi hubungan.
            </p>
          </div>
        </article>
        <article>
          <span className="blessing-number">03</span>
          <div>
            <h3>Memberikan Proteksi & Kekuatan Spiritual</h3>
            <p>
              Sakyant berfungsi sebagai pelindung spiritual, menstabilkan emosi,
              dan memperkuat aura positif.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
export function Journey() {
  return (
    <section className="journey section" id="journey">
      <div className="section-top">
        <div>
          <div className="eyebrow">A CONSIDERED EXPERIENCE</div>
          <h2>
            Apakah kamu
            <br />
            <em>mengalami hal ini?</em>
          </h2>
        </div>
        <p>
          Sakyant & Blessing Special
          <br />
          Makna untuk perjalanan personal Anda.
        </p>
      </div>
      <div className="steps">
        <article>
          <small>01 / YOUR JOURNEY</small>
          <h3>Merasa Stuck dalam Karier atau Bisnis</h3>
          <p>
            Banyak yang merasa usahanya stagnan, tidak berkembang, atau sulit
            menarik rezeki. Sakyant membantu membuka jalan keberuntungan dan
            kelancaran usaha.
          </p>
        </article>
        <article>
          <small>02 / YOUR JOURNEY</small>
          <h3>Hubungan Tidak Harmonis atau Sulit Menemukan Cinta</h3>
          <p>
            Blessing Saney dari Ajahn Fhuk dikenal mampu menarik energi cinta,
            keharmonisan, dan memperkuat daya tarik personal.
          </p>
        </article>
        <article>
          <small>03 / YOUR JOURNEY</small>
          <h3>Energi Negatif & Kurang Proteksi Spiritual</h3>
          <p>
            Beberapa orang merasa sering terkena gangguan, energi buruk, atau
            tidak stabil secara emosional. Sakyant memberikan perlindungan dan
            kekuatan spiritual.
          </p>
        </article>
      </div>
      <Link className="text-link journey-link" to="#booking">
        Konsultasikan kebutuhan Anda <span>↗</span>
      </Link>
    </section>
  );
}
export function Process() {
  return (
    <section className="process section" id="process">
      <div className="eyebrow">SEBELUM MEMULAI</div>
      <h2>
        Dari percakapan
        <br />
        <em>ke pengalaman.</em>
      </h2>
      <div className="steps">
        <article>
          <small>01</small>
          <h3>Konsultasi</h3>
          <p>
            Ceritakan inspirasi dan pertanyaan Anda kepada tim Purissa melalui
            WhatsApp.
          </p>
        </article>
        <article>
          <small>02</small>
          <h3>Kenali pilihan Anda</h3>
          <p>
            Diskusikan desain, makna, penempatan, serta pilihan Sak Yant atau
            blessing tanpa tato.
          </p>
        </article>
        <article>
          <small>03</small>
          <h3>Konfirmasi sesi</h3>
          <p>
            Tanyakan ketersediaan, biaya, lokasi, persiapan, dan panduan
            perawatan sebelum mengonfirmasi booking.
          </p>
        </article>
      </div>
      <Link className="text-link" to="/faq">
        Baca pertanyaan yang sering diajukan <span>↗</span>
      </Link>
    </section>
  );
}
export function EventsIntro() {
  return (
    <section className="page-intro section">
      <div className="eyebrow">EVENT PURISSA</div>
      <h1>
        Ruang untuk bertemu.
        <br />
        <em>Pengalaman untuk dikenang.</em>
      </h1>
      <p>
        Temukan informasi event Sak Yant & Blessing Purissa, kenali pengalaman
        sebelumnya, dan hubungi tim untuk jadwal berikutnya.
      </p>
    </section>
  );
}
export function EventSchedule() {
  return (
    <section className="event-schedule section">
      <div>
        <div className="eyebrow">JADWAL BERIKUTNYA</div>
        <h2>
          Mulai dari
          <br />
          <em>sebuah percakapan.</em>
        </h2>
        <p>
          Tanggal event terbaru belum ditampilkan di sini. Hubungi tim Purissa
          untuk informasi jadwal, ketersediaan, dan proses booking.
        </p>
        <a
          className="button gold"
          href="whatsapp://send?phone=628991778888&text=Halo%20saya%20mau%20booking%20Sakyant%20Event.%20Bisa%20dibantu%20proses%20nya%3F/"
        >
          Tanya jadwal via WhatsApp <span>↗</span>
        </a>
      </div>
      <aside>
        <span>SAK YANT & BLESSING</span>
        <h3>Jakarta Barat</h3>
        <p>
          Konsultasikan pilihan desain, sesi, dan detail kunjungan langsung
          bersama tim Purissa.
        </p>
        <Link className="text-link" to="/faq">
          Persiapan & FAQ <span>↗</span>
        </Link>
      </aside>
    </section>
  );
}
export function FaqIntro() {
  return (
    <section className="page-intro section">
      <div className="eyebrow">INFORMASI & PERSIAPAN</div>
      <h1>
        Sebelum memulai,
        <br />
        <em>temukan jawabannya.</em>
      </h1>
      <p>
        Kenali desain, teknik, durasi, dan pilihan blessing. Masih ada
        pertanyaan? Tim Purissa siap membantu melalui WhatsApp.
      </p>
    </section>
  );
}
export function GalleryIntro() {
  return (
    <section className="page-intro section">
      <div className="eyebrow">GALERI PURISSA</div>
      <h1>
        Ditorehkan di kulit.
        <br />
        <em>Dibawa dalam cerita.</em>
      </h1>
      <p>
        Jelajahi ragam karya Sak Yant Purissa. Gunakan panah atau titik untuk
        berpindah koleksi, lalu pilih foto untuk melihat detail.
      </p>
    </section>
  );
}
export function ArchiveHeading() {
  const { events } = useContent();
  const event = events.find((event) => event.id === legacyEvent.id);
  if (!event) return null;
  if (event.updatedAt)
    return (
      <div className="event-heading section">
        <div>
          <div className="eyebrow">
            EVENT PURISSA · {event.startDate} — {event.endDate}
          </div>
          <h2>{event.title}</h2>
        </div>
        <p>{event.hook}</p>
      </div>
    );
  return (
    <div className="event-heading section">
      <div>
        <div className="eyebrow">EVENT SEBELUMNYA · 05–07 DESEMBER 2025</div>
        <h2>
          Special Big
          <br />
          <em>Sakyant Event 2025.</em>
        </h2>
      </div>
      <p>
        Event ini telah berlangsung.
        <br />
        Jelajahi sorotan Sak Yant & Blessing Saney bersama Ajahn Fhuk.
      </p>
    </div>
  );
}
