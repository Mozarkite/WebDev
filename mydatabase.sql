--
-- PostgreSQL database dump
--

\restrict sLARwyq1VmqmEpoqXKySLFZrIMBprWM0ZNc9pGcPZIjO3VqBOQmEqIacMJcbxLV

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-18 16:13:10 GMT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 17225)
-- Name: db_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.db_tasks (
    task_id integer NOT NULL,
    task_name character varying(100) NOT NULL,
    task_category character varying(50) NOT NULL,
    task_importance integer NOT NULL,
    task_time_limit timestamp with time zone
);


ALTER TABLE public.db_tasks OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17224)
-- Name: db_tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.db_tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.db_tasks_task_id_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 221
-- Name: db_tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.db_tasks_task_id_seq OWNED BY public.db_tasks.task_id;


--
-- TOC entry 228 (class 1259 OID 17282)
-- Name: user_completed_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_completed_tasks (
    completed_id integer NOT NULL,
    user_id integer NOT NULL,
    todo_id integer NOT NULL,
    completed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_completed_tasks OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17281)
-- Name: user_completed_tasks_completed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_completed_tasks_completed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_completed_tasks_completed_id_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_completed_tasks_completed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_completed_tasks_completed_id_seq OWNED BY public.user_completed_tasks.completed_id;


--
-- TOC entry 230 (class 1259 OID 17303)
-- Name: user_favourited_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favourited_tasks (
    favourite_id integer NOT NULL,
    user_id integer NOT NULL,
    user_task_id integer,
    db_task_id integer,
    favourited_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_favourited_tasks_check CHECK ((((user_task_id IS NOT NULL) AND (db_task_id IS NULL)) OR ((user_task_id IS NULL) AND (db_task_id IS NOT NULL))))
);


ALTER TABLE public.user_favourited_tasks OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17302)
-- Name: user_favourited_tasks_favourite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_favourited_tasks_favourite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favourited_tasks_favourite_id_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 229
-- Name: user_favourited_tasks_favourite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_favourited_tasks_favourite_id_seq OWNED BY public.user_favourited_tasks.favourite_id;


--
-- TOC entry 224 (class 1259 OID 17236)
-- Name: user_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tasks (
    task_id integer NOT NULL,
    user_id integer NOT NULL,
    task_name character varying(100) NOT NULL,
    task_category character varying(50) NOT NULL,
    task_importance integer NOT NULL,
    task_time_limit timestamp with time zone
);


ALTER TABLE public.user_tasks OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17235)
-- Name: user_tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_tasks_task_id_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_tasks_task_id_seq OWNED BY public.user_tasks.task_id;


--
-- TOC entry 226 (class 1259 OID 17253)
-- Name: user_to_do_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_to_do_list (
    todo_id integer NOT NULL,
    user_id integer NOT NULL,
    user_task_id integer,
    db_task_id integer,
    task_name character varying(100) NOT NULL,
    task_category character varying(50) NOT NULL,
    task_importance integer NOT NULL,
    task_time_limit timestamp with time zone,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    completed boolean DEFAULT false,
    CONSTRAINT user_to_do_list_check CHECK ((((user_task_id IS NOT NULL) AND (db_task_id IS NULL)) OR ((user_task_id IS NULL) AND (db_task_id IS NOT NULL))))
);


ALTER TABLE public.user_to_do_list OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17252)
-- Name: user_to_do_list_todo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_to_do_list_todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_to_do_list_todo_id_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_to_do_list_todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_to_do_list_todo_id_seq OWNED BY public.user_to_do_list.todo_id;


--
-- TOC entry 220 (class 1259 OID 17212)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    email character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17211)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4882 (class 2604 OID 17228)
-- Name: db_tasks task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.db_tasks ALTER COLUMN task_id SET DEFAULT nextval('public.db_tasks_task_id_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 17285)
-- Name: user_completed_tasks completed_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_completed_tasks ALTER COLUMN completed_id SET DEFAULT nextval('public.user_completed_tasks_completed_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 17306)
-- Name: user_favourited_tasks favourite_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favourited_tasks ALTER COLUMN favourite_id SET DEFAULT nextval('public.user_favourited_tasks_favourite_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 17239)
-- Name: user_tasks task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tasks ALTER COLUMN task_id SET DEFAULT nextval('public.user_tasks_task_id_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 17256)
-- Name: user_to_do_list todo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_to_do_list ALTER COLUMN todo_id SET DEFAULT nextval('public.user_to_do_list_todo_id_seq'::regclass);


--
-- TOC entry 4881 (class 2604 OID 17215)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5070 (class 0 OID 17225)
-- Dependencies: 222
-- Data for Name: db_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.db_tasks (task_id, task_name, task_category, task_importance, task_time_limit) FROM stdin;
1	Clean your room	Household	2	\N
2	Do your laundry	Household	3	\N
3	Study for 1 hour	Education	4	\N
4	Read a chapter of a book	Personal Development	2	\N
5	Go for a 30-minute walk	Health	3	\N
6	Cook a healthy meal	Health	3	\N
7	Organize your workspace	Productivity	4	\N
8	Plan your week	Planning	5	\N
9	Meditate for 10 minutes	Wellbeing	1	\N
10	Drink 2 litres of water	Health	1	\N
11	Call a friend	Social	2	\N
12	Write in your journal	Personal Development	3	\N
13	Take a 20-minute power nap	Health	2	\N
14	Stretch for 10 minutes	Health	2	\N
15	Practice a hobby for 30 minutes	Personal Development	3	\N
16	Update your resume	Career	4	\N
17	Check your email inbox	Productivity	2	\N
18	Plan a vacation	Planning	4	\N
19	Clean out your fridge	Household	3	\N
20	Watch an educational video	Education	2	\N
21	Take a walk in nature	Wellbeing	3	\N
22	Declutter your desk	Productivity	2	\N
23	Write a to-do list for tomorrow	Planning	3	\N
24	Attend an online course	Education	4	\N
25	Spend 10 minutes on a language app	Education	3	\N
26	Volunteer for an hour	Social	4	\N
27	Write a letter to someone	Personal Development	2	\N
28	Go grocery shopping	Household	3	\N
29	Create a weekly meal plan	Health	3	\N
30	Wash your car	Household	3	\N
31	Do a digital detox for 1 hour	Wellbeing	4	\N
32	Spend 30 minutes reading news	Education	2	\N
33	Practice mindfulness for 10 minutes	Wellbeing	3	\N
34	Do a 30-minute workout	Health	4	\N
35	Update your financial budget	Planning	4	\N
36	Check your bank account	Finance	2	\N
37	Plan a workout routine	Health	3	\N
38	Write a blog post	Productivity	4	\N
39	Clear your email inbox	Productivity	3	\N
40	Spend 30 minutes on a creative project	Personal Development	3	\N
41	Write down your goals for the year	Personal Development	5	\N
42	Take notes for university lecture	Education	8	\N
43	Review today’s lecture slides	Education	7	\N
44	Revise notes from last week	Education	7	\N
45	Complete university assignment draft	Education	9	\N
46	Submit university assignment	Education	10	\N
47	Study for upcoming exam	Education	10	\N
48	Attend university lecture	Education	9	\N
49	Prepare for group presentation	Education	8	\N
50	Email professor regarding coursework	Education	7	\N
51	Organize university notes and folders	Education	6	\N
52	Pay monthly bills	Finance	10	\N
53	Check bank account balances	Finance	7	\N
54	Review monthly expenses	Finance	8	\N
55	Update personal budget	Finance	9	\N
56	Set or adjust savings goals	Finance	8	\N
57	Apply for a job	Career	9	\N
58	Prepare for job interview	Career	10	\N
59	Practice interview questions	Career	8	\N
60	Update CV and cover letter	Career	9	\N
61	Update LinkedIn profile	Career	7	\N
62	Back up important files	Productivity	9	\N
63	Clear critical email backlog	Productivity	7	\N
64	Create a daily task plan	Planning	8	\N
65	Set priorities for today	Planning	8	\N
66	Review long-term goals	Planning	9	\N
67	Book doctor or dentist appointment	Health	10	\N
68	Attend scheduled medical appointment	Health	10	\N
69	Prepare healthy meals for the week	Health	8	\N
70	Go to the gym or complete workout	Health	7	\N
71	Ensure at least 8 hours of sleep	Health	9	\N
72	Clean bathroom thoroughly	Household	7	\N
73	Do weekly house cleaning	Household	6	\N
74	Take out trash and recycling	Household	5	\N
75	Respond to urgent messages	Social	8	\N
76	Schedule time with close family	Social	7	\N
77	Reflect on academic or career progress	Personal Development	7	\N
78	Read mandatory course material	Personal Development	8	\N
\.


--
-- TOC entry 5076 (class 0 OID 17282)
-- Dependencies: 228
-- Data for Name: user_completed_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_completed_tasks (completed_id, user_id, todo_id, completed_at) FROM stdin;
\.


--
-- TOC entry 5078 (class 0 OID 17303)
-- Dependencies: 230
-- Data for Name: user_favourited_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_favourited_tasks (favourite_id, user_id, user_task_id, db_task_id, favourited_at) FROM stdin;
\.


--
-- TOC entry 5072 (class 0 OID 17236)
-- Dependencies: 224
-- Data for Name: user_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tasks (task_id, user_id, task_name, task_category, task_importance, task_time_limit) FROM stdin;
\.


--
-- TOC entry 5074 (class 0 OID 17253)
-- Dependencies: 226
-- Data for Name: user_to_do_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_to_do_list (todo_id, user_id, user_task_id, db_task_id, task_name, task_category, task_importance, task_time_limit, added_at, completed) FROM stdin;
\.


--
-- TOC entry 5068 (class 0 OID 17212)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, email) FROM stdin;
\.


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 221
-- Name: db_tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.db_tasks_task_id_seq', 78, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_completed_tasks_completed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_completed_tasks_completed_id_seq', 1, false);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 229
-- Name: user_favourited_tasks_favourite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_favourited_tasks_favourite_id_seq', 1, false);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tasks_task_id_seq', 1, false);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_to_do_list_todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_to_do_list_todo_id_seq', 1, false);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 4898 (class 2606 OID 17234)
-- Name: db_tasks db_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.db_tasks
    ADD CONSTRAINT db_tasks_pkey PRIMARY KEY (task_id);


--
-- TOC entry 4904 (class 2606 OID 17291)
-- Name: user_completed_tasks user_completed_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_completed_tasks
    ADD CONSTRAINT user_completed_tasks_pkey PRIMARY KEY (completed_id);


--
-- TOC entry 4906 (class 2606 OID 17312)
-- Name: user_favourited_tasks user_favourited_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favourited_tasks
    ADD CONSTRAINT user_favourited_tasks_pkey PRIMARY KEY (favourite_id);


--
-- TOC entry 4908 (class 2606 OID 17316)
-- Name: user_favourited_tasks user_favourited_tasks_user_id_db_task_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favourited_tasks
    ADD CONSTRAINT user_favourited_tasks_user_id_db_task_id_key UNIQUE (user_id, db_task_id);


--
-- TOC entry 4910 (class 2606 OID 17314)
-- Name: user_favourited_tasks user_favourited_tasks_user_id_user_task_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favourited_tasks
    ADD CONSTRAINT user_favourited_tasks_user_id_user_task_id_key UNIQUE (user_id, user_task_id);


--
-- TOC entry 4900 (class 2606 OID 17246)
-- Name: user_tasks user_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tasks
    ADD CONSTRAINT user_tasks_pkey PRIMARY KEY (task_id);


--
-- TOC entry 4902 (class 2606 OID 17265)
-- Name: user_to_do_list user_to_do_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_pkey PRIMARY KEY (todo_id);


--
-- TOC entry 4894 (class 2606 OID 17223)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4896 (class 2606 OID 17221)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4915 (class 2606 OID 17297)
-- Name: user_completed_tasks user_completed_tasks_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_completed_tasks
    ADD CONSTRAINT user_completed_tasks_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.user_to_do_list(todo_id) ON DELETE CASCADE;


--
-- TOC entry 4916 (class 2606 OID 17292)
-- Name: user_completed_tasks user_completed_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_completed_tasks
    ADD CONSTRAINT user_completed_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4917 (class 2606 OID 17327)
-- Name: user_favourited_tasks user_favourited_tasks_db_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favourited_tasks
    ADD CONSTRAINT user_favourited_tasks_db_task_id_fkey FOREIGN KEY (db_task_id) REFERENCES public.db_tasks(task_id) ON DELETE CASCADE;


--
-- TOC entry 4918 (class 2606 OID 17317)
-- Name: user_favourited_tasks user_favourited_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favourited_tasks
    ADD CONSTRAINT user_favourited_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4919 (class 2606 OID 17322)
-- Name: user_favourited_tasks user_favourited_tasks_user_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favourited_tasks
    ADD CONSTRAINT user_favourited_tasks_user_task_id_fkey FOREIGN KEY (user_task_id) REFERENCES public.user_tasks(task_id) ON DELETE CASCADE;


--
-- TOC entry 4911 (class 2606 OID 17247)
-- Name: user_tasks user_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tasks
    ADD CONSTRAINT user_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4912 (class 2606 OID 17276)
-- Name: user_to_do_list user_to_do_list_db_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_db_task_id_fkey FOREIGN KEY (db_task_id) REFERENCES public.db_tasks(task_id) ON DELETE CASCADE;


--
-- TOC entry 4913 (class 2606 OID 17266)
-- Name: user_to_do_list user_to_do_list_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4914 (class 2606 OID 17271)
-- Name: user_to_do_list user_to_do_list_user_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_user_task_id_fkey FOREIGN KEY (user_task_id) REFERENCES public.user_tasks(task_id) ON DELETE CASCADE;


-- Completed on 2025-12-14 23:30:21

--
-- PostgreSQL database dump complete
--

\unrestrict sLARwyq1VmqmEpoqXKySLFZrIMBprWM0ZNc9pGcPZIjO3VqBOQmEqIacMJcbxLV

