--
-- PostgreSQL database dump
--

\restrict pdYxq1nRKaU5IDJcRXlrCO08yRLf4WkclhBkRkaY0mq8S7UrO8AStUvftIYeFpp

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

DROP DATABASE postgres;
--
-- TOC entry 3505 (class 1262 OID 5)
-- Name: postgres; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_GB.UTF-8';


\unrestrict pdYxq1nRKaU5IDJcRXlrCO08yRLf4WkclhBkRkaY0mq8S7UrO8AStUvftIYeFpp
\connect postgres
\restrict pdYxq1nRKaU5IDJcRXlrCO08yRLf4WkclhBkRkaY0mq8S7UrO8AStUvftIYeFpp

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

--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 3505
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- TOC entry 861 (class 1247 OID 16390)
-- Name: bed_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bed_type_enum AS ENUM (
    'Standard',
    'Adjustable',
    'Orthopaedic'
);


--
-- TOC entry 864 (class 1247 OID 16398)
-- Name: entry_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.entry_type_enum AS ENUM (
    'Income',
    'Expense'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 17709)
-- Name: db_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.db_tasks (
    task_id integer NOT NULL,
    task_name character varying(100) NOT NULL,
    task_category character varying(50) NOT NULL,
    task_importance integer NOT NULL,
    task_time_limit timestamp with time zone
);


--
-- TOC entry 221 (class 1259 OID 17708)
-- Name: db_tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.db_tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 221
-- Name: db_tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.db_tasks_task_id_seq OWNED BY public.db_tasks.task_id;


--
-- TOC entry 228 (class 1259 OID 17766)
-- Name: user_completed_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_completed_tasks (
    completed_id integer NOT NULL,
    user_id integer NOT NULL,
    todo_id integer NOT NULL,
    completed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 227 (class 1259 OID 17765)
-- Name: user_completed_tasks_completed_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_completed_tasks_completed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_completed_tasks_completed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_completed_tasks_completed_id_seq OWNED BY public.user_completed_tasks.completed_id;


--
-- TOC entry 224 (class 1259 OID 17720)
-- Name: user_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_tasks (
    task_id integer NOT NULL,
    user_id integer NOT NULL,
    task_name character varying(100) NOT NULL,
    task_category character varying(50) NOT NULL,
    task_importance integer NOT NULL,
    task_time_limit timestamp with time zone
);


--
-- TOC entry 223 (class 1259 OID 17719)
-- Name: user_tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_tasks_task_id_seq OWNED BY public.user_tasks.task_id;


--
-- TOC entry 226 (class 1259 OID 17737)
-- Name: user_to_do_list; Type: TABLE; Schema: public; Owner: -
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
    CONSTRAINT user_to_do_list_check CHECK ((((user_task_id IS NOT NULL) AND (db_task_id IS NULL)) OR ((user_task_id IS NULL) AND (db_task_id IS NOT NULL))))
);


--
-- TOC entry 225 (class 1259 OID 17736)
-- Name: user_to_do_list_todo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_to_do_list_todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_to_do_list_todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_to_do_list_todo_id_seq OWNED BY public.user_to_do_list.todo_id;


--
-- TOC entry 220 (class 1259 OID 17696)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    email character varying(100) NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 17695)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3318 (class 2604 OID 17712)
-- Name: db_tasks task_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.db_tasks ALTER COLUMN task_id SET DEFAULT nextval('public.db_tasks_task_id_seq'::regclass);


--
-- TOC entry 3322 (class 2604 OID 17769)
-- Name: user_completed_tasks completed_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_completed_tasks ALTER COLUMN completed_id SET DEFAULT nextval('public.user_completed_tasks_completed_id_seq'::regclass);


--
-- TOC entry 3319 (class 2604 OID 17723)
-- Name: user_tasks task_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tasks ALTER COLUMN task_id SET DEFAULT nextval('public.user_tasks_task_id_seq'::regclass);


--
-- TOC entry 3320 (class 2604 OID 17740)
-- Name: user_to_do_list todo_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_to_do_list ALTER COLUMN todo_id SET DEFAULT nextval('public.user_to_do_list_todo_id_seq'::regclass);


--
-- TOC entry 3317 (class 2604 OID 17699)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3493 (class 0 OID 17709)
-- Dependencies: 222
-- Data for Name: db_tasks; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3499 (class 0 OID 17766)
-- Dependencies: 228
-- Data for Name: user_completed_tasks; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3495 (class 0 OID 17720)
-- Dependencies: 224
-- Data for Name: user_tasks; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3497 (class 0 OID 17737)
-- Dependencies: 226
-- Data for Name: user_to_do_list; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3491 (class 0 OID 17696)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'Mihi', '$2b$10$paODi1LURIXzn8K3ep6Fbu5CWGXPtKdkkKpFYfLMopQ/DQhNQNkrK', 'Mihai@gmail.com');


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 221
-- Name: db_tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.db_tasks_task_id_seq', 1, false);


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_completed_tasks_completed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_completed_tasks_completed_id_seq', 1, false);


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_tasks_task_id_seq', 1, false);


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_to_do_list_todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_to_do_list_todo_id_seq', 1, false);


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);


--
-- TOC entry 3330 (class 2606 OID 17718)
-- Name: db_tasks db_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.db_tasks
    ADD CONSTRAINT db_tasks_pkey PRIMARY KEY (task_id);


--
-- TOC entry 3336 (class 2606 OID 17775)
-- Name: user_completed_tasks user_completed_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_completed_tasks
    ADD CONSTRAINT user_completed_tasks_pkey PRIMARY KEY (completed_id);


--
-- TOC entry 3332 (class 2606 OID 17730)
-- Name: user_tasks user_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tasks
    ADD CONSTRAINT user_tasks_pkey PRIMARY KEY (task_id);


--
-- TOC entry 3334 (class 2606 OID 17749)
-- Name: user_to_do_list user_to_do_list_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_pkey PRIMARY KEY (todo_id);


--
-- TOC entry 3326 (class 2606 OID 17707)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3328 (class 2606 OID 17705)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3341 (class 2606 OID 17781)
-- Name: user_completed_tasks user_completed_tasks_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_completed_tasks
    ADD CONSTRAINT user_completed_tasks_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.user_to_do_list(todo_id) ON DELETE CASCADE;


--
-- TOC entry 3342 (class 2606 OID 17776)
-- Name: user_completed_tasks user_completed_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_completed_tasks
    ADD CONSTRAINT user_completed_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3337 (class 2606 OID 17731)
-- Name: user_tasks user_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tasks
    ADD CONSTRAINT user_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3338 (class 2606 OID 17760)
-- Name: user_to_do_list user_to_do_list_db_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_db_task_id_fkey FOREIGN KEY (db_task_id) REFERENCES public.db_tasks(task_id) ON DELETE CASCADE;


--
-- TOC entry 3339 (class 2606 OID 17750)
-- Name: user_to_do_list user_to_do_list_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3340 (class 2606 OID 17755)
-- Name: user_to_do_list user_to_do_list_user_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_to_do_list
    ADD CONSTRAINT user_to_do_list_user_task_id_fkey FOREIGN KEY (user_task_id) REFERENCES public.user_tasks(task_id) ON DELETE CASCADE;


-- Completed on 2025-11-18 16:13:11 GMT

--
-- PostgreSQL database dump complete
--

\unrestrict pdYxq1nRKaU5IDJcRXlrCO08yRLf4WkclhBkRkaY0mq8S7UrO8AStUvftIYeFpp

