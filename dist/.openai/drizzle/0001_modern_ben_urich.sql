CREATE TABLE `site_images` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`src` text NOT NULL,
	`upload_id` text,
	`title` text NOT NULL,
	`alt` text NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`position` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('home-intro','general','/assets/events/candle-blessing-ceremony.jpg','Beranda — Seni sakral','Suasana blessing dengan lilin di Purissa','TRADITION · INTENTION · CONNECTION',0,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('sak-yant-philosophy','general','/assets/events/candle-blessing-ceremony.jpg','Sak Yant & Blessing — Rooted in Tradition','Suasana ritual dengan lilin di Purissa','01 / THE PHILOSOPHY',1,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('01-paired-leg-sak-yant','gallery','/assets/gallery/01-paired-leg-sak-yant.jpg','Paired leg sak yant','Karya Sak Yant Purissa 01','',0,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('02-tiger-upper-arm','gallery','/assets/gallery/02-tiger-upper-arm.jpg','Tiger upper arm','Karya Sak Yant Purissa 02','',1,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('03-ornamental-leg-panel','gallery','/assets/gallery/03-ornamental-leg-panel.jpg','Ornamental leg panel','Karya Sak Yant Purissa 03','',2,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('04-vertical-side-torso','gallery','/assets/gallery/04-vertical-side-torso.jpg','Vertical side torso','Karya Sak Yant Purissa 04','',3,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('05-chest-sacred-symbols','gallery','/assets/gallery/05-chest-sacred-symbols.jpg','Chest sacred symbols','Karya Sak Yant Purissa 05','',4,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('06-standing-figure-upper-arm','gallery','/assets/gallery/06-standing-figure-upper-arm.jpg','Standing figure upper arm','Karya Sak Yant Purissa 06','',5,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('07-red-winged-figure','gallery','/assets/gallery/07-red-winged-figure.jpg','Red winged figure','Karya Sak Yant Purissa 07','',6,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('08-radial-geometric-symbols','gallery','/assets/gallery/08-radial-geometric-symbols.jpg','Radial geometric symbols','Karya Sak Yant Purissa 08','',7,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('09-dragon-leg-panel','gallery','/assets/gallery/09-dragon-leg-panel.jpg','Dragon leg panel','Karya Sak Yant Purissa 09','',8,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('10-balanced-upper-back','gallery','/assets/gallery/10-balanced-upper-back.jpg','Balanced upper back','Karya Sak Yant Purissa 10','',9,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('11-neck-and-shoulder-script','gallery','/assets/gallery/11-neck-and-shoulder-script.jpg','Neck and shoulder script','Karya Sak Yant Purissa 11','',10,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('12-small-upper-back-symbol','gallery','/assets/gallery/12-small-upper-back-symbol.jpg','Small upper back symbol','Karya Sak Yant Purissa 12','',11,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('13-dense-shoulder-panel','gallery','/assets/gallery/13-dense-shoulder-panel.jpg','Dense shoulder panel','Karya Sak Yant Purissa 13','',12,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('14-full-back-composition','gallery','/assets/gallery/14-full-back-composition.jpg','Full back composition','Karya Sak Yant Purissa 14','',13,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('15-vertical-spine-script','gallery','/assets/gallery/15-vertical-spine-script.jpg','Vertical spine script','Karya Sak Yant Purissa 15','',14,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('16-winged-back-composition','gallery','/assets/gallery/16-winged-back-composition.jpg','Winged back composition','Karya Sak Yant Purissa 16','',15,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('17-seated-figure-detail','gallery','/assets/gallery/17-seated-figure-detail.jpg','Seated figure detail','Karya Sak Yant Purissa 17','',16,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('18-script-forearm-sleeve','gallery','/assets/gallery/18-script-forearm-sleeve.jpg','Script forearm sleeve','Karya Sak Yant Purissa 18','',17,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('19-large-back-temple-panel','gallery','/assets/gallery/19-large-back-temple-panel.jpg','Large back temple panel','Karya Sak Yant Purissa 19','',18,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('20-tiger-detail','gallery','/assets/gallery/20-tiger-detail.jpg','Tiger detail','Karya Sak Yant Purissa 20','',19,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('21-circular-tiger-emblem','gallery','/assets/gallery/21-circular-tiger-emblem.jpg','Circular tiger emblem','Karya Sak Yant Purissa 21','',20,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('22-ganesha-detail','gallery','/assets/gallery/22-ganesha-detail.jpg','Ganesha detail','Karya Sak Yant Purissa 22','',21,0,0);

--> statement-breakpoint
INSERT INTO site_images (id,kind,src,title,alt,caption,position,deleted,updated_at) VALUES ('23-ornamental-upper-arm','gallery','/assets/gallery/23-ornamental-upper-arm.jpg','Ornamental upper arm','Karya Sak Yant Purissa 23','',22,0,0);

--> statement-breakpoint
INSERT INTO events (id,title,hook,start_date,end_date,caption,images_json,status,created_at,updated_at) VALUES ('3c917bfd-67b6-4e17-9607-6419e5cf5cc8','Special Big Sakyant Event','Sak Yant & Blessing Saney bersama Ajahn Fhuk · Jakarta Barat.','2025-12-05','2025-12-07','Special Big Sakyant Event bersama Ajahn Fhuk. Jelajahi sorotan Sak Yant & Blessing Saney di Jakarta Barat.','[{"id": "140e4f90-b7e8-4758-8248-8ee647aca355", "url": "/assets/events/master-handpoke-session.jpg", "caption": "More than ink. A sacred connection."}, {"id": "e1398c9a-3919-4054-802e-c962847087bb", "url": "/assets/events/candle-blessing-ceremony.jpg", "caption": "Ancient wisdom. Personal meaning."}, {"id": "ceac67e4-5ec0-4c80-bc5f-5e2035698b2c", "url": "/assets/gallery/13-dense-shoulder-panel.jpg", "caption": "Every line. A deeper meaning."}]','published',0,0);
